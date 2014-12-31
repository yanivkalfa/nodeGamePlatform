module.exports = function(_s){
    var _connection, _models;

    _connection = require('./connection.js')(_s);
    _models = require('./models.js')(_s, _connection);

    return {
        _connection : _connection,
        _models : _models
    }
};