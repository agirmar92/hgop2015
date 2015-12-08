var _ = require('lodash');
module.exports = function tictactoeCommandHandler(events) {
  return {
    executeCommand: function(cmd) {
      return [{
        id: cmd.id,
        event: "GameCreated",
        userName: cmd.userName,
        timeStamp: cmd.timeStamp,
        name: cmd.name
      }];
    }
  }
};