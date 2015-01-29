
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

        passwordHash : {
            type :String
        },

        firName : {
            type : String
        },

        lastName : {
            type : String
        },

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

        spark : {
            type :String
        },

        rooms : {
            type : Array,
            default : ['lobby']
        },

        roles : {
            type : Array,
            default : ['registered']
        },

        server : {
            type :String,
            required : true
        },

        facebookToken : {
            type : String
        },

        token : {
            type : String
        }
    }
};