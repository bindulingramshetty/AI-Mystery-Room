const { z } = require("zod");

const MODEL_NAME = "gemini-3.5-flash-lite";

// Difficulty configuration
const difficultySettings = {
    easy: {
        suspects: 3,
        clues: 5,
        hints: 2
    },
    medium: {
        suspects: 4,
        clues: 7,
        hints: 3
    },
    hard: {
        suspects: 5,
        clues: 9,
        hints: 3
    }
};

// Validate AI-generated mystery
const MysterySchema = z.object({
    title: z.string(),
    premise: z.string(),
    setting: z.string(),

    suspects: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            role: z.string(),
            description: z.string(),
            motive: z.string(),
            alibi: z.string()
        })
    ),

    clues: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            discoveredText: z.string()
        })
    ),

    culpritId: z.string(),
    solutionExplanation: z.string(),
    reasoningChain: z.array(z.string()),
    openingNarrative: z.string()
});

// Generate a complete mystery using Gemini
async function generateMystery(difficulty, userPremise) {

    const settings = difficultySettings[difficulty];

    if (!settings) {
        throw new Error("Invalid difficulty level.");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are an expert mystery writer and investigation game designer.

Create an original, logically consistent detective mystery.

USER'S MYSTERY IDEA:
${userPremise || "Create an original mystery involving a suspicious incident."}

DIFFICULTY: ${difficulty}

EXACT REQUIREMENTS:
- Suspects: exactly ${settings.suspects}
- Clues: exactly ${settings.clues}
- Available hints: ${settings.hints}

GENERATE THE FOLLOWING:

1. A compelling mystery title.
2. A detailed mystery premise.
3. The location and setting.
4. Exactly ${settings.suspects} unique suspects.
5. Exactly ${settings.clues} meaningful clues.
6. One clearly identified culprit.
7. A detailed solution explanation.
8. A logical reasoning chain.
9. An engaging opening narrative.

SUSPECT REQUIREMENTS:
Each suspect must have:
- Unique ID.
- Name.
- Role.
- Description.
- Possible motive.
- Alibi.

CLUE REQUIREMENTS:
Each clue must have:
- Unique ID.
- Title.
- Description.
- Discovered text explaining what the investigator learns.

LOGIC REQUIREMENTS:
- Only one culprit.
- Every clue must contribute to the investigation.
- The culprit must be identifiable through evidence.
- Suspects must have believable motives and alibis.
- Avoid contradictions.
- The solution must explain all important clues.
- Do not make the culprit obvious immediately.

OUTPUT:
Return ONLY valid JSON.
Do not include Markdown or code fences.

Use exactly this JSON structure:

{
  "title": "Mystery title",
  "premise": "Mystery premise",
  "setting": "Location",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Name",
      "role": "Role",
      "description": "Description",
      "motive": "Possible motive",
      "alibi": "Alibi"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Clue title",
      "description": "Clue description",
      "discoveredText": "Information revealed after discovery"
    }
  ],
  "culpritId": "suspect_1",
  "solutionExplanation": "Complete explanation",
  "reasoningChain": [
    "Reasoning step 1",
    "Reasoning step 2"
  ],
  "openingNarrative": "Opening story"
}
`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const rawText = response.text;

        if (!rawText) {
            throw new Error("Gemini returned an empty response.");
        }

        const parsed = JSON.parse(
            rawText.replace(/```json|```/g, "").trim()
        );

        const mystery = MysterySchema.parse(parsed);

        if (mystery.suspects.length !== settings.suspects) {
            throw new Error("Incorrect number of suspects generated.");
        }

        if (mystery.clues.length !== settings.clues) {
            throw new Error("Incorrect number of clues generated.");
        }

        const culpritExists = mystery.suspects.some(
            suspect => suspect.id === mystery.culpritId
        );

        if (!culpritExists) {
            throw new Error("Generated culprit does not match any suspect.");
        }

        return {
            ...mystery,
            difficulty,
            totalHints: settings.hints
        };

    } catch (error) {
        console.error("Mystery generation failed:", error.message);
        throw error;
    }
}

module.exports = {
    generateMystery,
    difficultySettings
};