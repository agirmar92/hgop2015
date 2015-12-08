var _ = require('lodash');
module.exports = function tictactoeCommandHandler(events) {
  return {
    executeCommand: function(cmd) {
      return [{"id":"987","event":"GameCreated","userName":"Agirmar","timeStamp":"2015.05.07T09:15:22","name":"InitialGame"}];
    }
  }
};