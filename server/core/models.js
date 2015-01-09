module.exports = function(_s, connection){
    var models = require('../settings/models'),modelsSchema, modelName, schema, model = [];

    models.forEach(function(model){
        schema = new _s.oReq.mongoose.Schema(model.schema);
        global[model.name] = connection.model(model.name, schema);
        model.push(global[model.name]);
    });

    return this;
};