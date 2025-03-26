const Score = require('../models/ScoreModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

//zwróć tablicę z wynikami dla użytkowników na podstawie tablicy id użytkowników
module.exports.getScoreLinesForUsers = catchAsync(async (req,res,next) => {
    
})

//pobierz score dla konkretnego użytkownika i konkretnego pokoju
module.exports.getScoreLineForGameRoom = catchAsync(async (req,res,next) => {
    //TODO - zadziała po autoryzacji
    const score = await Score.findOne({gameRoomId: req.params.gameRoomId, userId: req.userId});

    if(!score) return next(new AppError('There is no score for user in this gameroom', 404));

    res.status(200).json({
        status: 'success',
        data: {
            score
        }
    })
})

module.exports.getScoreLineById = catchAsync(async (req,res,next) => {
    const score = await Score.findById(req.params.scoreId);

    if(!score) return next(new AppError('There is no score for user in this gameroom', 404));

    res.status(200).json({
        status: 'success',
        data: {
            score
        }
    })
})

// zaktualizuj wynik dla użytkownika
module.exports.createScoreAPI = catchAsync(async (req,res,next) => {
    const score = await Score.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            score,
        },
    });
})

// utwórz score dla uzytkownika i GameRoomu
module.exports.createScore = catchAsync(async (data) => {
    const score = await Score.create(data);

    return true;
})

// zaktualizuj wynik dla użytkownika
module.exports.updateScore = catchAsync(async (data) => {
    const {userId, gameRoomId, pointsToAdd} = data;

    const score = await Score.findOne({userId, gameRoomId});

    if(!score) return new AppError('There is no score for user in this gameroom', 404);

    const newValue = parseInt(score.points) + parseInt(pointsToAdd);

    const updatedScore = await Score.findOneAndUpdate({userId, gameRoomId},{points: newValue})

    return true;
})

// zaktualizuj wynik dla użytkownika
module.exports.updateScoreAPI = catchAsync(async (req,res,next) => {
    const updatedScore = await Score.findByIdAndUpdate(req.params.scoreId, req.body, {
        new: true,
        runValidators: true,
    });

    if(!updatedScore) return next(new AppError('There is not Score with specific Id', 404));

    res.status(200).json({
        status: 'success',
        data: {
            updatedScore,
        },
    });
})

module.exports.deleteScore = catchAsync(async (req,res,next) => {
    const score = await Score.findByIdAndDelete(req.params.scoreId);

    if (!score) {
        return next(new AppError('No Score found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
})