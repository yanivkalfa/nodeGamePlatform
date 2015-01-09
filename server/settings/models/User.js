
module.exports = {

    name : "User",

    schema : {

        username : {
            type :'string',
            required : true
        },

        password : {
            type :'string',
            required : true
        },

        passwordHash : {
            type :'string'
        },

        firName : {
            type : 'string'
        },

        lastName : {
            type : 'string'
        },

        eMail : {
            type :'string',
            required : false,
            unique : false
        },

        email : {
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