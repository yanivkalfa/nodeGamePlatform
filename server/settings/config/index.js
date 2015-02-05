module.exports = function(_s){
  return {
      connections : require('./connections.js'),
      session : require('./session.js'),
      routs : require('./routs.js'),
      constants : require('./constants.js')(_s)
  }
};