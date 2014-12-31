module.exports = function(_s, connection){
    var models = require('../settings/models'),modelsSchema, modelName, schema, model = [];

    for(modelName in models){
        //console.log(modelName);
        schema = new _s.oReq.mongoose.Schema(models[modelName].schema);
        global[modelName] = connection.model(modelName, schema);
        model.push(global[modelName]);
    }

    return model;
};