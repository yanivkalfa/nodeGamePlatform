
module.exports = {

    name : "User",

    schema : {

        userName : {
            type :'string',
            required : true
        },

        password : {
            type :'string',
            required : true
        },

        firName : {
            type : 'string'
        },

        lastName : {
            type : 'string'
        },

        eMail : {
            type :'string',
            required : true,
            unique : true
        },

        facebookToken : {
            type : 'string'
        },

        token : {
            type : 'string'
        }
    }
};