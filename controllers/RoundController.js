const Round = require('../models/RoundModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

module.exports.getAllRounds = catchAsync(async (req, res, next) => {
    const rounds = await Round.find({gameRoomId: req.params.gameroom}).sort('-deadLineDate');

    res.status(200).json({
        status: 'success',
        data: {
            rounds,
        },
    });
});

module.exports.getRoundById = catchAsync(async (req, res, next) => {
    const round = await Round.findById(req.params.id);

    if (!round) {
        return next(new AppError('No Round found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            round,
        },
    });
});

module.exports.createRounds = catchAsync(async (req, res, next) => {
    if (!req.body.rounds) {
        return next(new AppError('Provide at least one Round to add', 404));
    }

    const data = req.body.rounds.map((round) => {
        return { ...round, gameRoomId: req.params.gameroom };
    });
    
    const round = await Round.create(data);

    res.status(201).json({
        status: 'success',
        data: {
            round,
        },
    });
});

module.exports.updateRoundById = catchAsync(async (req, res, next) => {
    const round = await Round.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!round) {
        return next(new AppError('No Round found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            round,
        },
    });
});

module.exports.deleteRoundById = catchAsync(async (req, res, next) => {
    const round = await Round.findByIdAndDelete(req.params.id);

    if (!round) {
        return next(new AppError('No Round found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});