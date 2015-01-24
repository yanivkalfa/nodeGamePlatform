
module.exports = {

    name : "Users",

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

        spark : {
            type :'string'
        },

        rooms : {
            type : 'array',
            default : ['lobby']
        },

        roles : {
            type : 'array',
            default : ['registered']
        },

        facebookToken : {
            type : 'string'
        },

        token : {
            type : 'string'
        }
    }
};