
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

module.exports = {

    name : "Queues",

    schema : {

        out_id : {
            type :String
        },

        name : {
            type :String,
            required : true
        },

        room : {
            type :String
        },

        start : {
            type :Date,
            required : true
        },

        game : { type: Schema.Types.ObjectId, ref: 'Games' },
        users : { type: Schema.Types.ObjectId, ref: 'Users' }
    }
};