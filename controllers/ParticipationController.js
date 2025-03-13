const Participation = require('../models/ParticipationModel');
const User = require('../models/UserModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

module.exports.setParticipation = catchAsync(async (req, res, next) => {
    const data = {...req.body};

    const participation = await Participation.create(data);

    res.status(201).json({
        status: 'success',
        data: {
            participation,
        },
    });
});

module.exports.getGameRoomUsers = catchAsync(async (req, res, next) => {
    const gameRoomId = req.params.gameRoomId;

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