
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

module.exports = {

    name : "Queues",

    schema : {

        name : {
            type :String,
            required : true
        },

        room : String,

        start : {
            type :Date,
            required : true
        },

        end :Date,

        occupied : Boolean,

        game : { type: Schema.Types.ObjectId, ref: 'Games' },
        user : { type: Schema.Types.ObjectId, ref: 'Users' }
    }
};