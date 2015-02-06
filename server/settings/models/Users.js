var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    ;

module.exports = {

    name : "Users",

    schema : {

        username : {
            type :String,
            required : true
        },

        password : {
            type :String,
            required : true
        },

        passwordHash : String,

        firstName : String,

        lastName : String,

        email : {
            type :String,
            required : true,
            index : {
                unique : true
            }
        },

        uType : {
            type :String,
            required : true,
            default : 'user'
        },

        spark : String,

        server : Object,

        rooms : {
            type : Array,
            default : ['lobby']
        },

        queues : [{ type: Schema.Types.ObjectId, ref: 'Story' }],

        roles : {
            type : Array,
            default : ['registered']
        },

        facebookToken : String,

        token : String
    }
};