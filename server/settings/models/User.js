
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
            type :'string',
            required : true
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

        facebookToken : {
            type : 'string'
        },

        token : {
            type : 'string'
        }
    }
};