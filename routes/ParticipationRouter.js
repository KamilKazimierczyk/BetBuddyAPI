const express = require('express');
const ParticipationController= require('../controllers/ParticipationController');

const router = express.Router();

router.route('/').post(ParticipationController.setParticipation);

router.route('/:gameRoomId').get(ParticipationController.getGameRoomUsersAPI);

router.route('/:gameRoomId/:userId').delete(ParticipationController.deleteParticipation);

module.exports = router;