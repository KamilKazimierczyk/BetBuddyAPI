const mongoose = require('mongoose');

const GameRoomSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Game Room must have a name.'],
        trim: true,
        minlength: [3, 'Game Room name must contains at least 3 letters'],
        maxlength: [50, "Game Room name can't contain more then 50 letters"],
    },
    // creator: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: [true, 'Game Room must have an creator.'],
    // },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});

GameRoomSchema.virtual('rounds', {
    ref: 'Round',
    foreignField: 'gameRoomId',
    localField: '_id',
  });

const GameRoomModel = mongoose.model('GameRoom',GameRoomSchema);

module.exports = GameRoomModel;