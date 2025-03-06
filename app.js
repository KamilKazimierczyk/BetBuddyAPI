const express = require('express');
const GameRoomRouter = require('./routes/GameRoomRouter');

const errorHandler = require('./controllers/ErrorController');
const AppError = require('./util/AppError')

const app = express();

app.use(express.json());

app.use('/api/v1/gameRoom', GameRoomRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;