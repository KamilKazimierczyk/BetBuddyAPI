const express = require('express');
const GameRoomRouter = require('./routes/GameRoomRouter');
const UserRouter = require('./routes/UserRouter');
const ParticipationRouter = require('./routes/ParticipationRouter');
const BetRouter = require('./routes/BetRouter');
const ScoreRouter = require('./routes/ScoreRouter');
const setScoreRouter = require('./routes/setScoreRouter');

const errorHandler = require('./controllers/ErrorController');
const AppError = require('./util/AppError')

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    req.time = new Date();
    next();
})

app.use('/api/v1/gameRoom', GameRoomRouter);
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/participation', ParticipationRouter);
app.use('/api/v1/bet',BetRouter);
app.use('/api/v1/score',ScoreRouter);
app.use('/api/v1/event',setScoreRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;