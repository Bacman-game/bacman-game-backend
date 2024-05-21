const { Schema, model, models } = require('mongoose');

const ScoreSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    version: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

const Score = models.Score || model("Score", ScoreSchema);
module.exports = Score;