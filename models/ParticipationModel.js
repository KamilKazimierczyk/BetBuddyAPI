const mongoose = require('mongoose');

const ParticipationSchema = new mongoose.Schema({
    gameRoomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'GameRoom',
        required: [true, 'Participation must be attached to a Game room.'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Participation must be attached to a User.'],
    },
})

const Participation = mongoose.model('Participation', ParticipationSchema);

module.exports = Participation;