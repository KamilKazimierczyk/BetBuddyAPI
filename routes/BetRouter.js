const express = require('express');
const BetController = require('../controllers/BetController')

const router = express.Router({ mergeParams: true });

router.route('/').post(BetController.placeBet)

router.route('/:betId').patch(BetController.updateBet).delete(BetController.deleteBet);

router.route('/getBetFromEvent/:eventId').get(BetController.getBetFromEvent)

module.exports = router;