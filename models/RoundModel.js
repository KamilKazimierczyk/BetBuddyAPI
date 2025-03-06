const mongoose = require('mongoose');
const EventModel = require('./EventModel.js');

const RoundSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Round must have a name.'],
        trim: true,
        minlength: [3, 'Round name must contains at least 3 letters'],
        maxlength: [50, "Round name can't contain more then 50 letters"],
    },
    gameRoomId: {
        type: mongoose.Schema.ObjectId,
        ref: 'GameRoom',
        required: [true, 'Round must be attached to a Game room.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    deadLineDate: {
        type: Date,
        required: [true, 'Round have to have a deadline date.']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
})

RoundSchema.virtual('events', {
    ref: 'Event',
    foreignField: 'roundId',
    localField: '_id',
});

RoundSchema.index({ deadLineDate: '1' });

const RoundModel = mongoose.model('Round',RoundSchema);

module.exports = RoundModel;