const express = require('express');
const ScoreController = require('../controllers/ScoreController')

const router = express.Router({ mergeParams: true });

router.route('/').post(ScoreController.createScoreAPI)

router.route('/:scoreId').get(ScoreController.getScoreLineById).patch(ScoreController.updateScoreAPI).delete(ScoreController.deleteScore);

//TODO - endpointy pod dwie pierwsze metody Contollera

module.exports = router;