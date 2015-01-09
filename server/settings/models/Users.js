
module.exports = {

    name : "Users",

    schema : {

        username : {
            type :'String',
            required : true
        },

        password : {
            type :'String',
            required : true
        },

        passwordHash : {
            type :'String'
        },

        firName : {
            type : 'String'
        },

        lastName : {
            type : 'String'
        },

        email : {
            type :'String',
            required : true,
            unique : true
        },

        roles : {
            type : 'Array',
            default : ['registered']
        },

        facebookToken : {
            type : 'String'
        },

        token : {
            type : 'String'
        }
    }
};