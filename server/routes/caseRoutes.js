const express = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");

const MysteryCase = require("../models/Case");
const { generateMystery } = require("../services/geminiService");

const router = express.Router();

const MODEL_NAME = "gemini-3.5-flash-lite";

// Validate mystery creation requests
const CreateCaseSchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"]),
    premise: z.string().max(1000).optional().default("")
});

// Scoring configuration
const baseScores = {
    easy: 100,
    medium: 150,
    hard: 200
};

// Public response: never expose the hidden solution
function publicCase(caseDoc) {
    const data = caseDoc.toObject();

    delete data.culpritId;
    delete data.solutionExplanation;
    delete data.reasoningChain;

    data.clues = data.clues.map(clue => {
        const discovered = data.discoveredClueIds.includes(clue.id);

        return {
            id: clue.id,
            title: clue.title,
            discovered,
            ...(discovered ? {
                description: clue.description,
                discoveredText: clue.discoveredText
            } : {})
        };
    });

    return data;
}

// Validate MongoDB ID
function validId(id) {
    return mongoose.isValidObjectId(id);
}


// ======================================
// 1. CREATE A NEW MYSTERY
// POST /api/cases
// ======================================

router.post("/", async (req, res) => {
    try {
        const input = CreateCaseSchema.parse(req.body);

        const mystery = await generateMystery(
            input.difficulty,
            input.premise
        );

        const newCase = await MysteryCase.create(mystery);

        res.status(201).json({
            success: true,
            message: "Mystery created successfully!",
            case: publicCase(newCase)
        });

    } catch (error) {
        console.error("Create case error:", error.message);

        res.status(error instanceof z.ZodError ? 400 : 500).json({
            success: false,
            message: error instanceof z.ZodError
                ? "Invalid mystery details."
                : "Unable to generate mystery. Please try again."
        });
    }
});


// ======================================
// 2. GET A MYSTERY
// GET /api/cases/:id
// ======================================

router.get("/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case ID."
            });
        }

        const mystery = await MysteryCase.findById(req.params.id);

        if (!mystery) {
            return res.status(404).json({
                success: false,
                message: "Mystery not found."
            });
        }

        res.json({
            success: true,
            case: publicCase(mystery)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve mystery."
        });
    }
});


// ======================================
// 3. DISCOVER A CLUE
// POST /api/cases/:id/clues/:clueId/discover
// ======================================

router.post("/:id/clues/:clueId/discover", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case ID."
            });
        }

        const mystery = await MysteryCase.findById(req.params.id);

        if (!mystery) {
            return res.status(404).json({
                success: false,
                message: "Mystery not found."
            });
        }

        if (mystery.status !== "investigating") {
            return res.status(400).json({
                success: false,
                message: "This investigation is already completed."
            });
        }

        const clue = mystery.clues.find(
            item => item.id === req.params.clueId
        );

        if (!clue) {
            return res.status(404).json({
                success: false,
                message: "Clue not found."
            });
        }

        const alreadyDiscovered =
            mystery.discoveredClueIds.includes(clue.id);

        if (!alreadyDiscovered) {
            mystery.discoveredClueIds.push(clue.id);
            await mystery.save();
        }

        res.json({
            success: true,
            message: alreadyDiscovered
                ? "Clue already discovered."
                : "Clue discovered successfully!",
            clue: {
                id: clue.id,
                title: clue.title,
                description: clue.description,
                discoveredText: clue.discoveredText
            },
            pointsEarned: alreadyDiscovered ? 0 : 5,
            totalDiscovered: mystery.discoveredClueIds.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to discover clue."
        });
    }
});


// ======================================
// 4. REQUEST AN INVESTIGATION HINT
// POST /api/cases/:id/hints
// ======================================

router.post("/:id/hints", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case ID."
            });
        }

        const mystery = await MysteryCase.findById(req.params.id);

        if (!mystery) {
            return res.status(404).json({
                success: false,
                message: "Mystery not found."
            });
        }

        if (mystery.status !== "investigating") {
            return res.status(400).json({
                success: false,
                message: "Investigation already completed."
            });
        }

        if (mystery.hintsUsed >= mystery.totalHints) {
            return res.status(400).json({
                success: false,
                message: "No hints remaining."
            });
        }

        const discoveredClues = mystery.clues
            .filter(clue =>
                mystery.discoveredClueIds.includes(clue.id)
            )
            .map(clue => ({
                title: clue.title,
                information: clue.discoveredText
            }));

        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `
You are a helpful detective investigation assistant.

Mystery:
${mystery.premise}

Suspects:
${JSON.stringify(mystery.suspects)}

Discovered clues:
${JSON.stringify(discoveredClues)}

Give the player one short, useful investigation hint.

Rules:
- Do not reveal the culprit.
- Do not reveal the complete solution.
- Encourage logical investigation.
- Do not invent evidence.
- Keep the hint under 50 words.
`
        });

        const hint = response.text;

        if (!hint) {
            throw new Error("Empty hint response from Gemini.");
        }

        mystery.hintsUsed += 1;
        await mystery.save();

        res.json({
            success: true,
            hint,
            hintsRemaining: mystery.totalHints - mystery.hintsUsed,
            pointsDeducted: 10
        });

    } catch (error) {
        console.error("Hint error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to generate hint."
        });
    }
});


// ======================================
// 5. ACCUSE A SUSPECT
// POST /api/cases/:id/accuse
// ======================================

router.post("/:id/accuse", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case ID."
            });
        }

        const { suspectId } = req.body;

        if (typeof suspectId !== "string" || !suspectId.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please select a suspect."
            });
        }

        const mystery = await MysteryCase.findById(req.params.id)
            .select("+culpritId +solutionExplanation +reasoningChain");

        if (!mystery) {
            return res.status(404).json({
                success: false,
                message: "Mystery not found."
            });
        }

        if (mystery.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "This mystery has already been solved."
            });
        }

        const suspectExists = mystery.suspects.some(
            suspect => suspect.id === suspectId
        );

        if (!suspectExists) {
            return res.status(400).json({
                success: false,
                message: "Invalid suspect selection."
            });
        }

        const isCorrect = suspectId === mystery.culpritId;

        let score = 0;

        if (isCorrect) {
            score = baseScores[mystery.difficulty]
                + (mystery.discoveredClueIds.length * 5)
                - (mystery.hintsUsed * 10);

            score = Math.max(0, score);
        }

        mystery.accusedSuspectId = suspectId;
        mystery.isCorrect = isCorrect;
        mystery.score = score;
        mystery.status = "completed";

        await mystery.save();

        res.json({
            success: true,
            verdict: isCorrect ? "CORRECT" : "INCORRECT",
            isCorrect,
            accusedSuspectId: suspectId,
            culpritId: mystery.culpritId,
            solutionExplanation: mystery.solutionExplanation,
            reasoningChain: mystery.reasoningChain,
            score,
            discoveredClues: mystery.discoveredClueIds.length,
            hintsUsed: mystery.hintsUsed
        });

    } catch (error) {
        console.error("Accusation error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to process accusation."
        });
    }
});


// ======================================
// 6. GET FINAL RESULT
// GET /api/cases/:id/result
// ======================================

router.get("/:id/result", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case ID."
            });
        }

        const mystery = await MysteryCase.findById(req.params.id)
            .select("+culpritId +solutionExplanation +reasoningChain");

        if (!mystery) {
            return res.status(404).json({
                success: false,
                message: "Mystery not found."
            });
        }

        if (mystery.status !== "completed") {
            return res.status(403).json({
                success: false,
                message: "Complete your investigation first."
            });
        }

        res.json({
            success: true,
            verdict: mystery.isCorrect ? "CORRECT" : "INCORRECT",
            culpritId: mystery.culpritId,
            solutionExplanation: mystery.solutionExplanation,
            reasoningChain: mystery.reasoningChain,
            score: mystery.score,
            difficulty: mystery.difficulty,
            discoveredClues: mystery.discoveredClueIds.length,
            hintsUsed: mystery.hintsUsed
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to retrieve results."
        });
    }
});

module.exports = router;