const Participation = require('../models/ParticipationModel');
const User = require('../models/UserModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

const GameRoom = require('../models/GameRoomModel');
const DocumentExists = require('../util/DocumentExists');

module.exports.setParticipation = catchAsync(async (req, res, next) => {
    const data = {...req.body};

    const gameRoom = await DocumentExists(data.gameRoomId,GameRoom);

    if(!gameRoom) return next(new AppError('No GameRoom found with this Id', 404))

    const participation = await Participation.create(data);

    ///TODO - dodanie score dla uzytkownika

    res.status(201).json({
        status: 'success',
        data: {
            participation,
        },
    });
});

module.exports.getGameRoomUsers = async (gameRoomId) => {
    const gameRoom = await DocumentExists(gameRoomId,GameRoom);

    if(!gameRoom) return new AppError('No GameRoom found with this Id', 404)

    const participations = await Participation.find({gameRoomId});
    
    if(participations.length == 0) return new AppError('No Participations found for this game room', 404)

    const userIds = participations.map(item => ({_id: item.userId}));

    const users = await User.find({$or:userIds});

    return {
        gameRoomId,
        users,
    }
};

module.exports.getGameRoomUsersAPI = catchAsync(async (req, res, next) => {
    const gameRoomId = req.params.gameRoomId;

    const gameRoom = await DocumentExists(gameRoomId,GameRoom);

    if(!gameRoom) return next(new AppError('No GameRoom found with this Id', 404))

    const participations = await Participation.find({gameRoomId});
    
    if(participations.length == 0) return next(new AppError('No Participations found for this game room', 404))

    const userIds = participations.map(item => ({_id: item.userId}));

    const users = await User.find({$or:userIds});

    res.status(200).json({
        status: 'success',
        data: {
            gameRoomId,
            users,
        },
    });
});

module.exports.deleteParticipation = catchAsync(async (req,res,next) => {
    const participation = await Participation.findOneAndDelete({gameRoomId: req.params.gameRoomId,userId:req.params.userId});

    if (!participation) {
        return next(new AppError('No Participation found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
})