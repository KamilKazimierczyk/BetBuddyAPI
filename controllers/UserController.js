const User = require('../models/UserModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError')

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users,
        },
    });
});

module.exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

module.exports.createUser = catchAsync(async (req, res, next) => {
    const data = {...req.body};
    const user = await User.create(data);

    res.status(201).json({
        status: 'success',
        data: {
            user,
        },
    });
});

module.exports.updateUserById = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

module.exports.deleteUserById = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No Game room found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});