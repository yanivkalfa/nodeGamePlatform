
module.exports = {

    /*
    * which connection to use as default
    * */
    defaultConnection : "mongoDB",

    /*
    * what is the collection name to use for models.
    * */
    defaultCollection : "nodeExpIOTesting",

    /*
    * number of connection retries.
    * */
    retries : 5,

    /*
    * mongo db
    * */
    mongoDB: {
        adapter     : 'mongoose',
        host        : '54.165.132.121',
        port        : 27017,
        user        : 'testDB',
        password    : 'abc123',
        database    : 'testDB'
    },


    /*
     * redis db
     * */
    redis: {
        adapter     : 'redis',
        host        : '54.165.132.121',
        port        : 6379
    }


};