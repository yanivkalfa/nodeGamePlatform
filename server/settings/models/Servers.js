
module.exports = {

    name : "Users",

    schema : {

        name : {
            type :'string',
            required : true
        },

        port : {
            type :'string',
            required : true
        },

        address : {
            type :'string'
        },

        maxConnections : {
            type : 'string'
        }
    }
};