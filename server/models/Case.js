const mongoose = require("mongoose");

const suspectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, required: true },
    motive: { type: String, required: true },
    alibi: { type: String, required: true }
}, { _id: false });

const clueSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discoveredText: { type: String, required: true }
}, { _id: false });

const caseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    premise: {
        type: String,
        required: true
    },

    setting: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    suspects: [suspectSchema],

    clues: [clueSchema],

    // Secret solution: never expose this before accusation.
    culpritId: {
        type: String,
        required: true,
        select: false
    },

    solutionExplanation: {
        type: String,
        required: true,
        select: false
    },

    reasoningChain: {
        type: [String],
        select: false
    },

    openingNarrative: {
        type: String,
        required: true
    },

    totalHints: {
        type: Number,
        required: true
    },

    discoveredClueIds: {
        type: [String],
        default: []
    },

    hintsUsed: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["investigating", "completed"],
        default: "investigating"
    },

    accusedSuspectId: {
        type: String,
        default: null
    },

    score: {
        type: Number,
        default: 0
    },

    isCorrect: {
        type: Boolean,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("MysteryCase", caseSchema);