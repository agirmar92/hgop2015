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
    if (event.event === "MovePlaced") {
      makeMove(event.move.x, event.move.y, event.user.side);
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
    "PlaceMove": function(cmd) {
      var reply = [{
        event: "",
        gameId: cmd.gameId,
        user: {
          userName: cmd.user.userName,
          side: cmd.user.side
        },
        name: cmd.name,
        move: {
          x: cmd.move.x,
          y: cmd.move.y
        },
        timeStamp: cmd.timeStamp
      }];

      if ((cmd.move.x < 0 || cmd.move.x > 3) || (cmd.move.y < 0 || cmd.move.y > 3)) {
        reply[0].event = "IllegalMove (out of bounds)";
      } else if (gameState.board[cmd.move.x][cmd.move.y] !== '') {
        reply[0].event = "IllegalMove (move already made)";
      } else {
        makeMove(cmd.move.x, cmd.move.y, cmd.user.side);
        var finished = isFinished(cmd.move.x, cmd.move.y, cmd.user.side);
        reply[0].event = "MovePlaced";

        if (finished) {
          reply.push({
            event: "",
            gameId: cmd.gameId,
            user: {
              userName: cmd.user.userName,
              side: cmd.user.side
            },
            timeStamp: cmd.timeStamp
          });

          if (finished === 1) {
            reply[1].event = "GameWon";
          } else {
            reply[1].event = "GameDraw";
          }
        }
      }
      
      return reply;
    }, 

    "CreateGame": function(cmd) {
      return [{
        id: cmd.id,
        event: "GameCreated",
        gameId: cmd.gameId,
        user: {
          userName: cmd.user.userName,
          side: cmd.user.side
        },
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
          user: {
            userName: cmd.user.userName,
            side: cmd.user.side
          },
          timeStamp: cmd.timeStamp
        }];
      }

      var joinAble = false;
      for (var i = 0; i < events.length; i++) {
        var currEvent = events[i];
        if (currEvent.event === "GameCreated")
          joinAble = true;
        if (currEvent.event === "GameJoined") {
          joinAble = false;
          break;
        }
      }

      if (!joinAble) {
        return [{
          id: cmd.id,
          event: "GameIsFull",
          gameId: cmd.gameId,
          user: {
            userName: cmd.user.userName,
            side: cmd.user.side
          },
          timeStamp: cmd.timeStamp
        }];
      }
      return [{
        id: cmd.id,
        event: "GameJoined",
        gameId: cmd.gameId,
        user: {
          userName: cmd.user.userName,
          side: cmd.user.side
        },
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