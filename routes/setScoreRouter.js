const express = require('express');
const EventController = require('../controllers/EventController')

const router = express.Router({ mergeParams: true });

router.route('/setScore/:eventId').post(EventController.setScore);

module.exports = router;