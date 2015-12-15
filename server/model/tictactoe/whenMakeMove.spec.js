var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('when make move command', function() {

  var given, when, then;

  // Before each test, we join a created game
  beforeEach(function() {
    given = [{
      id: "987",
      comm: "CreateGame",
      gameId: "10",
      user: {
        userName: "Agirmar",
        side: "X"
      },
      name: "InitialGame",
      timeStamp: "2015.05.07T09:15:22"
    }, {
      id: "9876",
      event: "GameJoined",
      gameId: "10",
      user: {
        userName: "Gummi",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:35"
    }];
  });

  describe('on new game', function() {
    it('should make the first move', function() {
      when = {
        comm: "PlaceMove",
        gameId: "10",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:25"
      };
      then = [{
        event: "MovePlaced",
        gameId: "10",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:25"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should get invalid move message, trying to make a move outside the board', function() {
      when = {
        comm: "PlaceMove",
        gameId: "10",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 9,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:25"
      };

      then = [{
        event: "IllegalMove (out of bounds)",
        gameId: "10",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 9,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:25"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });

  describe('one previous move', function() {
    it('should get invalid move message, trying to make a move already made', function() {
      given.push({
        event: "MovePlaced",
        gameId: "11",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:25"
      });

      when = {
        comm: "PlaceMove",
        gameId: "11",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:35"
      };

      then = [{
        event: "IllegalMove (move already made)",
        gameId: "11",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:18:35"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });

  describe('game in progress', function() {
    /*
      GIVEN
      X * O
      X * O
      O * X
    */
    beforeEach(function() {
      given = [{
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 0,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:00"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 2,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:05"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 0,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:10"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 0,
          y: 2
        },
        timeStamp: "2015.05.07T09:19:15"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 2,
          y: 2
        },
        timeStamp: "2015.05.07T09:19:20"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 2,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:25"
      }];
    });

    it('should make a move and X wins', function() {
      when = {
        comm: "PlaceMove",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:30"
      };

      then = [
        {
          event: "MovePlaced",
          gameId: "13",
          user: {
            userName: "Agirmar",
            side: "X"
          },
          move: {
            x: 1,
            y: 1
          },
          timeStamp: "2015.05.07T09:19:30"
        },
        {
          event: "GameWon",
          gameId: "13",
          user: {
            userName: "Agirmar",
            side: "X"
          },
          timeStamp: "2015.05.07T09:19:30"
        }
      ];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should make a move and O wins', function() {
      given.push({
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:30"
      });

      when = {
        comm: "PlaceMove",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:35"
      };

      then = [
        {
          event: "MovePlaced",
          gameId: "13",
          user: {
            userName: "Gummi",
            side: "O"
          },
          move: {
            x: 1,
            y: 1
          },
          timeStamp: "2015.05.07T09:19:35"
        },
        {
          event: "GameWon",
          gameId: "13",
          user: {
            userName: "Gummi",
            side: "O"
          },
          timeStamp: "2015.05.07T09:19:35"
        }
      ];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });

  describe('game in progress, to be a draw', function() {
    /*
        GIVEN
        O X O
        X X O
        * O X
    */
    it('should make a move and draw the game', function() {
      given = [{
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:00"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 2,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:05"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 0,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:10"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 0,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:15"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 1,
          y: 0
        },
        timeStamp: "2015.05.07T09:19:20"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 2,
          y: 1
        },
        timeStamp: "2015.05.07T09:19:25"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 2,
          y: 2
        },
        timeStamp: "2015.05.07T09:19:30"
      }, {
        event: "MovePlaced",
        gameId: "13",
        user: {
          userName: "Gummi",
          side: "O"
        },
        move: {
          x: 1,
          y: 2
        },
        timeStamp: "2015.05.07T09:19:35"
      }];

      when = {
        comm: "PlaceMove",
        gameId: "13",
        user: {
          userName: "Agirmar",
          side: "X"
        },
        move: {
          x: 0,
          y: 2
        },
        timeStamp: "2015.05.07T09:19:40"
      };

      then = [
        {
          event: "MovePlaced",
          gameId: "13",
          user: {
            userName: "Agirmar",
            side: "X"
          },
          move: {
            x: 0,
            y: 2
          },
          timeStamp: "2015.05.07T09:19:40"
        },
        {
          event: "GameDraw",
          gameId: "13",
          user: {
            userName: "Agirmar",
            side: "X"
          },
          timeStamp: "2015.05.07T09:19:40"
        }
      ];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });
});