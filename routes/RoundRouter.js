const express = require('express');
const RoundController = require('../controllers/RoundController');

const EventRouter = require('./EventRouter');

const router = express.Router({ mergeParams: true });

router.use('/:round/event',EventRouter);

router.route('/').get(RoundController.getAllRounds).post(RoundController.createRounds);

router.route('/:id').get(RoundController.getRoundById).patch(RoundController.updateRoundById).delete(RoundController.deleteRoundById);

module.exports = router;