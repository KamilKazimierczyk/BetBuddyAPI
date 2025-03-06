const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Event must have a name.'],
        trim: true,
        minlength: [3, 'Event name must contains at least 3 letters'],
        maxlength: [50, "Event name can't contain more then 50 letters"],
    },
    type: {
        type: String,
        enum: {
            values: ['scoreline','winner'],
            message: 'There are only two types of events: scoreline and winner',
        },
    },
    roundId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Round',
        required: [true, 'Event must be attached to a Round.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    options: {
        type: [String],
        validate: {
            validator: function(v){
                let type = this.type;
                if(this.options?.type) type = this.options.type;

                if((type == 'winner' && v.length > 1) || type == 'scoreline') return true;
                else return false
            },
            message: "If the type of an event is ste to 'winner' u have to specify at least 2 options"
        }
    },
    firstSide: {
        type: String,
        validate: {
            validator: function(v){
                let type = this.type;
                if(this.options?.type) type = this.options.type;

                if((type == 'scoreline' && v) || type == 'winner') return true;
                else return false
            },
            message: "If the type of an event is ste to 'scoreline' u have to specify first side of an event"
        }
    },
    secondSide: {
        type: String,
        validate: {
            validator: function(v){
                let type = this.type;
                if(this.options?.type) type = this.options.type;

                if((type == 'scoreline' && v) || type == 'winner') return true;
                else return false
            },
            message: "If the type of an event is ste to 'scoreline' u have to specify second side of an event"
        }
    },
    correctResault: {
        type: String,
        default: ''
    }
});

EventSchema.pre('save', function(){
    if(this.isNew)this.correctResault = '';
})

const EventModel = mongoose.model('Event',EventSchema);

module.exports = EventModel;