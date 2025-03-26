const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: [true, 'Bet must be attached to an Event.'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Bet must be attached to a User.'],
    },
    betValue: {
        type: String,
        required: [true, 'Bet must contain a value.']
    }
})

const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;