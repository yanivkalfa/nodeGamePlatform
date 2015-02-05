
module.exports = {

    name : "Games",

    schema : {

        name : {
            type :String,
            required : true,
            index : {
                unique : true
            }
        },

        userCount : {
            type :String,
            required : true
        },

        queueName : {
            type :String
        }
    }
};