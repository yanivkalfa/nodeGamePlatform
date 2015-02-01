
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

        playerCount : {
            type :String,
            required : true
        },

        queueName : {
            type :String
        }
    }
};