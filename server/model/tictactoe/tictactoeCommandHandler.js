var _ = require('lodash');
module.exports = function tictactoeCommandHandler(events) {
  return {
    executeCommand: function(cmd) {
      if (cmd.comm === "CreateGame") {
        return [{
          id: cmd.id,
          event: "GameCreated",
          userName: cmd.userName,
          timeStamp: cmd.timeStamp,
          name: cmd.name
        }];
      } else {
        return [{
          id: cmd.id,
          event: "GameJoined",
          userName: cmd.userName,
          otherUserName: events[0].userName,
          name: cmd.name,
          timeStamp: cmd.timeStamp
        }];
      }
    }
  }
};