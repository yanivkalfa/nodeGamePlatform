
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

        email : {
            type :'string',
            required : true,
            unique : true
        },

        eMail : {
            type :'string'
        },

        facebookToken : {
            type : 'string'
        },

        token : {
            type : 'string'
        }
    }
};