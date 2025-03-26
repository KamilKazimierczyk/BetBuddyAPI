const Event = require('../models/EventModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

const Round = require('../models/RoundModel');
const DocumentExists = require('../util/DocumentExists');

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