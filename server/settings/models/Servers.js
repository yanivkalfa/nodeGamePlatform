
module.exports = {

    name : "Servers",

    schema : {

        name : {
            type :'string',
            required : true
        },

        port : {
            type :'int',
            required : true
        },

        address : {
            type :'string',
            required : true
        },

        maxConnections : {
            type : 'int'
        }
    }
};