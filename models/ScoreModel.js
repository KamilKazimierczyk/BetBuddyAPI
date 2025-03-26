const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    gameRoomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'GameRoom',
        required: [true, 'Score must be attached to an Game Room.'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Score must be attached to a User.'],
    },
    points: {
        type: Number,
        default: 0
    }
})

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;