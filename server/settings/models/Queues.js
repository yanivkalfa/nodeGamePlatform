
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

module.exports = {

    name : "Queues",

    schema : {

        _id : String,

        out_id : String,

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

        game : { type: Schema.Types.ObjectId, ref: 'Games' },
        user : { type: Schema.Types.ObjectId, ref: 'Users' }
    }
};