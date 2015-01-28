
module.exports = {

    name : "Servers",

    schema : {

        "name" : {
            type :'string',
            required : true
        },
        "port" : {
            type :'number',
            required : true
        },
        "address" : {
            type :'string',
            required : true
        },
        "user" : {
            type :'object',
            default : {"email" : "", "password" : ""}
        }
    }
};