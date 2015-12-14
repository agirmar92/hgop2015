var _ = require('lodash');
module.exports = function tictactoeCommandHandler(events) {

  var gameState = {
    gameCreatedEvent : events[0],
    board: [['','',''],['','',''],['','','']],
    movesMade: 0
  };

  var makeMove = function(x, y, side) {
    gameState.board[x][y] = side;
    gameState.movesMade++;
  }

  _.each(events, function(event){
    if (event.event === "MoveMade") {
      makeMove(event.x, event.y, event.side);
    }
  });

  // Returns 0 if the game is not finished
  // Returns 1 if the player that just made a move has won
  // Returns 2 if the game finished a draw
  var isFinished = function(x, y, side) {
    // Check for diagonal win
    if (gameState.board[0][0] === side && gameState.board[1][1] === side && gameState.board[2][2] === side) {
      return 1;
    } 
    if (gameState.board[2][0] === side && gameState.board[1][1] === side && gameState.board[0][2] === side) {
      return 1;
    }
    // Check for row win
    if (gameState.board[x][0] === side && gameState.board[x][1] === side && gameState.board[x][2] === side) {
      return 1;
    }
    // Check for column win
    if (gameState.board[0][y] === side && gameState.board[1][y] === side && gameState.board[2][y] === side) {
      return 1;
    }

    // Check for a draw
    if (gameState.movesMade === 9)
      return 2;

    // Not finished
    return 0;
  }

  // For debugging purposes
  var printBoard = function() {
    for(var i = 0; i < 3; i++) {
      console.log(gameState.board[0][i] + " " + gameState.board[1][i] + " " + gameState.board[2][i]); 
    }
  }

  var handlers = {
    "MakeMove": function(cmd) {
      var reply = [{
        id: cmd.id,
        event: "",
        gameId: cmd.gameId,
        userName: cmd.userName,
        name: cmd.name,
        x: cmd.x,
        y: cmd.y,
        side: cmd.side,
        timeStamp: cmd.timeStamp
      }];

      if ((cmd.x < 0 || cmd.x > 3) || (cmd.y < 0 || cmd.y > 3)) {
        reply[0].event = "IllegalMove (out of bounds)";
      } else if (gameState.board[cmd.x][cmd.y] !== '') {
        reply[0].event = "IllegalMove (move already made)";
      } else {
        makeMove(cmd.x, cmd.y, cmd.side);
        var finished = isFinished(cmd.x, cmd.y, cmd.side);

        if (finished === 0) {
          reply[0].event = "MoveMade";
        } else if (finished === 1) {
          reply[0].event = "WinningMoveMade";
        } else if (finished === 2) {
          reply[0].event = "DrawMoveMade";
        }
      }
      
      return reply;
    }, 

    "CreateGame": function(cmd) {
      return [{
        id: cmd.id,
        event: "GameCreated",
        gameId: cmd.gameId,
        userName: cmd.userName,
        timeStamp: cmd.timeStamp,
        name: cmd.name
      }];
    },

    "JoinGame": function(cmd) {
      if (!events[0]) {
        return [{
          id: cmd.id,
          event: "GameDoesNotExist",
          gameId: cmd.gameId,
          name: cmd.name,
          userName: cmd.userName,
          timeStamp: cmd.timeStamp
        }];
      }
      if (events[1]) {
        return [{
          id: cmd.id,
          event: "GameIsFull",
          gameId: cmd.gameId,
          userName: cmd.userName,
          name: cmd.name,
          timeStamp: cmd.timeStamp
        }];
      }
      return [{
        id: cmd.id,
        event: "GameJoined",
        gameId: cmd.gameId,
        userName: cmd.userName,
        otherUserName: events[0].userName,
        name: cmd.name,
        timeStamp: cmd.timeStamp
      }];
    }
  };

  return {
    executeCommand: function(cmd) {
      var handlerToRun = handlers[cmd.comm];
      if (handlerToRun)
        return handlerToRun(cmd);
    }
  }
};