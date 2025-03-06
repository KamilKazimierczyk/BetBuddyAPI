const express = require('express');
const EventController = require('../controllers/EventController')

const router = express.Router({ mergeParams: true });

router.route('/').get(EventController.getAllEvents).post(EventController.createEvents);

router.route('/:id').get(EventController.getEventById).patch(EventController.updateEventById).delete(EventController.deleteEventById);

module.exports = router;