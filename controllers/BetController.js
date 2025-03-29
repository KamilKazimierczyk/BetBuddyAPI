const Bet = require('../models/BetModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const checkBet = require('../util/checkBet')

const DocumentExists = require('../util/DocumentExists');
const Event = require('../models/EventModel');
const Round = require('../models/RoundModel');
const Participation = require('../models/ParticipationModel');

module.exports.placeBet = catchAsync(async (req, res, next) => {
    //TODO - po zrobieniu autoryzacji nalezy uzyc tutaj id usrtawionego w req wczesniej
    //czy istnieje taki event
    const exist = await DocumentExists(req.body.eventId,Event);

    if(!exist) return next(new AppError('No Event found with this Id', 404));

    //czy użytkownik przynależy do tego pokoju
    const event = (await Event.findById(req.body.eventId));
    const round = (await Round.findById(event.roundId));
    
    const participation = await Participation.findOne({gameRoomId: round.gameRoomId, userId: req.body.userId});

    if(!participation) return next(new AppError('U need to be part of GameRoom to place a Bet.',403))
    //weryfikacja deadline
    const requestTime = new Date(req.time).getTime();
    const deadLineTime = new Date(round.deadLineTime).getTime();

    if(requestTime > deadLineTime) return next(new AppError("U can't place Bet after dead line time.",400))

    //weryfikacja poprawności betu [typu]
    const wrongType = checkBet(event,req.body.betValue);

    if(!wrongType) return next(new AppError('Bet is incorrect check if you placed correct type and value', 400))

    //dodanie betu
    const bet = await Bet.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            bet,
        },
    });
});

module.exports.getBetFromEvent = catchAsync(async (req, res, next) => {
    //TODO - po zrobieniu autoryzacji nalezy uzyc tutaj id usrtawionego w req wczesniej
    const bet = await Bet.findOne({eventId: req.params.eventId, userId: req.body.userId})

    if(!bet) return next(new AppError('No Bet found for this Event', 404));

    res.status(200).json({
        status: 'success',
        data: {
            bet
        }
    });
});

module.exports.getBet = async (eventId,userId) => {
    const bet = await Bet.findOne({userId,eventId});

    return bet;
}

module.exports.updateBet = catchAsync(async (req,res,next) => {
    //czy użytkownik jest twórcą tego zakładu
    const userId = req.body.userId;

    const bet = await Bet.findById(req.params.betId);

    if(!bet) return next(new AppError('No Bet found with this Id', 404));
    if(userId !== bet.userId.toString()) return next(new AppError('U are unautorized to change this bet',403))

    //weryfikacja deadline
    const event = (await Event.findById(bet.eventId));
    const round = (await Round.findById(event.roundId));

    const requestTime = new Date(req.time).getTime();
    const deadLineTime = new Date(round.deadLineTime).getTime();
    
    if(requestTime > deadLineTime) return next(new AppError("U can't place Bet after dead line time.",400))

    const wrongType = checkBet(event,req.body.betValue);

    if(!wrongType) return next(new AppError('Bet is incorrect check if you placed correct type and value', 400))
    
    //update betu
    const updatedBet = await Bet.findByIdAndUpdate(req.params.betId, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            updatedBet,
        },
    });
})

module.exports.deleteBet = catchAsync(async (req,res,next) => {
    const bet = await Bet.findByIdAndDelete(req.params.betId);

    if (!bet) {
        return next(new AppError('No Bet found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
})