const express = require('express');
const GameRoomController = require('../controllers/GameRoomController');

const RoundRouter = require('./RoundRouter')

const router = express.Router();

router.use('/:gameroom/round', RoundRouter);

router.route('/').get(GameRoomController.getAllGameRooms).post(GameRoomController.createGameRoom);

router.route('/:id').get(GameRoomController.getGameRoomById).patch(GameRoomController.updateGameRoomById).delete(GameRoomController.deleteGameRoomById);

module.exports = router;