const AppError = require('../util/AppError');

const Event = require('../models/EventModel');
const Round = require('../models/RoundModel');

const ParticipationController = require('../controllers/ParticipationController');
const ScoreController = require('../controllers/ScoreController');
const BetController = require('../controllers/BetController');

module.exports = updateScoreForUsers = async (eventId,correctResult) => {
    const event = await Event.findById(eventId);
    const round = await Round.findById(event.roundId);

    const users = await ParticipationController.getGameRoomUsers(round.gameRoomId)
    
    users.users.forEach(async (user) => {
        //check score
        const {betValue} = await BetController.getBet(eventId,user._id.toString());
        let pointsToAdd = 0;

        if(event.type == 'scoreline'){
            if(betValue == correctResult) {
                pointsToAdd = 3;
            } else {
                const correctResultSplitted = correctResult.split('-').map(item => parseInt(item));
                const betValueSplitted = betValue.split('-').map(item => parseInt(item));

                if((correctResultSplitted[0] > correctResultSplitted[1] && betValueSplitted[0] > betValueSplitted[1]) ||
                (correctResultSplitted[1] > correctResultSplitted[0] && betValueSplitted[1] > betValueSplitted[0]) ||
                (correctResultSplitted[0] == correctResultSplitted[1] && betValueSplitted[0] == betValueSplitted[1])
                ) pointsToAdd = 1;
            }
        }else {
            if(betValue == correctResult) pointsToAdd = 1;
        }

        await ScoreController.updateScore({userId: user._id.toString(), gameRoomId: round.gameRoomId, pointsToAdd})

        return true;
    })

    return true;
}