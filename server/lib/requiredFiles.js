module.exports = function(_s){
    var rf = {};
    rf.express = require('express');
    rf.lodash = require('lodash');
    rf.bodyParser = require('body-parser');
    rf.fs = require('fs');
    rf.app = rf.express();
    rf.http = require('http').Server(rf.app);
    rf.path = require('path');
    rf.jade = require('jade');
    rf.Primus = require('primus');
    rf.primusCluster = require('primus-cluster');
    rf.primusEmitter = require('primus-emitter');
    rf.primusRooms = require('primus-rooms');
    rf.primusResource = require('primus-resource');
    rf.primusMultiplex = require('primus-multiplex');
    rf.Promise = require('bluebird');
    rf.mongoose = rf.Promise.promisifyAll(require('mongoose'));
    rf.redis = require('redis');
    rf.session = require('express-session');
    rf.RedisStore = require('connect-redis')(rf.session);
    rf.jwt = require('jsonwebtoken');
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.User = require('./User.js')(_s);

    return rf;
};