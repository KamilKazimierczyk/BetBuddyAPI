const Event = require('../models/EventModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const checkBet = require('../util/checkBet');
const updateScoreForUsers = require('../util/updateScoreForUsers')

const Round = require('../models/RoundModel');
const DocumentExists = require('../util/DocumentExists');

module.exports.setScore = catchAsync(async (req,res,next) => {
    const eventId = req.params.eventId;
    const result = req.body.result;
    const event = await Event.findById(eventId);

    if(!event) return next(new AppError('Ther is no event with given Id', 404))
    
    if(event.correctResault !== '') return next(new AppError('Correct resault already exists for this event', 400))
    //TODO - weryfikacja czy jestes ownerem gameRoom
    

    //poprawnosc wyniku - typ itp
    const wrongType = checkBet(event,result);

    if(!wrongType) return next(new AppError('Score is incorrect check if you placed correct type and value', 400))

    //weryfikacja deadline
    const round = (await Round.findById(event.roundId));

    const requestTime = new Date(req.time).getTime();
    const deadLineTime = new Date(round.deadLineDate).getTime();

    if(deadLineTime > requestTime) return next(new AppError("U can't set Score before dead line time.",400))

    //dodanie wyniku
    const updatedEvent = await Event.findByIdAndUpdate(eventId,{correctResault: result});

    //dodanie punktów uzytkownikom
    const scoreUpdate = await updateScoreForUsers(eventId,result)

    //zwrotka
    res.status(200).json({
        status: 'success',
        scoreUpdated: scoreUpdate
    })
})

//TODO - weryfikacja czy owner GameRoom dodaje eventy

module.exports.getAllEvents = catchAsync(async (req, res, next) => {
    const events = await Event.find({roundId: req.params.round}).sort('-name');

    res.status(200).json({
        status: 'success',
        data: {
            events,
        },
    });
});

module.exports.getEventById = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new AppError('No Event found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            event,
        },
    });
});

module.exports.createEvents = catchAsync(async (req, res, next) => {
    if (!req.body.events) {
        return next(new AppError('Provide at least one Event to add', 404));
    }

    const round = await DocumentExists(req.params.round,Round);

    if(!round) return next(new AppError('No Round found with this Id', 404))

    const data = req.body.events.map((event) => {
        return { ...event, roundId: req.params.round };
    });
    
    const event = await Event.create(data);

    res.status(201).json({
        status: 'success',
        data: {
            event,
        },
    });
});

module.exports.updateEventById = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new AppError('No Event found with that ID', 404));
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        type: event.type
    });

    res.status(200).json({
        status: 'success',
        data: {
            updatedEvent,
        },
    });
});

module.exports.deleteEventById = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
        return next(new AppError('No Event found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});