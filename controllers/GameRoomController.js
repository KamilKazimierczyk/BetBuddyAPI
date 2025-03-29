const GameRoom = require('../models/GameRoomModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

const Participation = require('../models/ParticipationModel');

module.exports.getAllGameRooms = catchAsync(async (req, res, next) => {
    const gameRooms = await GameRoom.find();

    res.status(200).json({
        status: 'success',
        data: {
            gameRooms,
        },
    });
});

module.exports.getGameRoomById = catchAsync(async (req, res, next) => {
    const gameRoom = await GameRoom.findById(req.params.id).populate('rounds');

    if (!gameRoom) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            gameRoom,
        },
    });
});

module.exports.createGameRoom = catchAsync(async (req, res, next) => {
    const data = {...req.body, correctResault: ''};
    const gameRoom = await GameRoom.create(data);

    //TODO - po autoryzacji dodanie Participation twórcy pokoju do utworzonego pokoju

    res.status(201).json({
        status: 'success',
        data: {
            gameRoom,
        },
    });
});

module.exports.updateGameRoomById = catchAsync(async (req, res, next) => {
    //Blokada updatu po dead line
    const gameRoom = await GameRoom.findByIdAndUpdate(req.params.id, {...req.body,correctResault: ''}, {
        new: true,
        runValidators: true,
    });

    if (!gameRoom) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            gameRoom,
        },
    });
});

module.exports.deleteGameRoomById = catchAsync(async (req, res, next) => {
    const gameRoom = await GameRoom.findByIdAndDelete(req.params.id);

    if (!gameRoom) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});