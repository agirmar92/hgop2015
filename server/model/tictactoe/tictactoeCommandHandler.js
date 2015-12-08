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
        if (!events[0]) {
          return [{
            id: cmd.id,
            event: "GameDoesNotExist",
            name: cmd.name,
            userName: cmd.userName,
            timeStamp: cmd.timeStamp
          }];
        }
        if (events[1]) {
          return [{
            id: cmd.id,
            event: "GameIsFull",
            userName: cmd.userName,
            name: cmd.name,
            timeStamp: cmd.timeStamp
          }];
        }
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