var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('when make move command', function() {

  var given, when, then;

  // Before each test, we join a created game
  beforeEach(function() {
    given = [{
      id: "987",
      comm: "CreateGame",
      gameId: "10",
      userName: "Agirmar",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:15:22"
    }, {
      id: "9876",
      event: "GameJoined",
      gameId: "10",
      userName: "Gummi",
      otherUserName: "Agirmar",
      timeStamp: "2015.05.07T09:17:35"
    }];
  });

  describe('on new game', function() {
    it('should make the first move', function() {
      when = {
        id: "123",
        comm: "MakeMove",
        gameId: "10",
        userName: "Agirmar",
        name:"InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:18:25"
      };
      then = [{
        id: "123",
        event: "MoveMade",
        gameId: "10",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:18:25"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should get invalid move message, trying to make a move outside the board', function() {
      when = {
        id: "123",
        comm: "MakeMove",
        gameId: "10",
        userName: "Agirmar",
        name:"InitialGame",
        x: 9,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:18:25"
      };

      then = [{
        id: "123",
        event: "IllegalMove (out of bounds)",
        gameId: "10",
        userName: "Agirmar",
        name: "InitialGame",
        x: 9,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:18:25"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });

  describe('one previous move', function() {
    it('should get invalid move message, trying to make a move already made', function() {
      given.push({
        id: "123",
        event: "MoveMade",
        gameId: "11",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:18:25"
      });

      when = {
        id: "1234",
        comm: "MakeMove",
        gameId: "11",
        userName: "Gummi",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'O',
        timeStamp: "2015.05.07T09:18:35"
      };

      then = [{
        id: "1234",
        event: "IllegalMove (move already made)",
        gameId: "11",
        userName: "Gummi",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'O',
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
        id: "123",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 0,
        y: 0,
        side: 'X',
        timeStamp: "2015.05.07T09:19:00"
      }, {
        id: "321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 2,
        y: 0,
        side: 'O',
        timeStamp: "2015.05.07T09:19:05"
      }, {
        id: "1234",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 0,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:19:10"
      }, {
        id: "4321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 0,
        y: 2,
        side: 'O',
        timeStamp: "2015.05.07T09:19:15"
      }, {
        id: "12345",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 2,
        y: 2,
        side: 'X',
        timeStamp: "2015.05.07T09:19:20"
      }, {
        id: "54321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 2,
        y: 1,
        side: 'O',
        timeStamp: "2015.05.07T09:19:25"
      }];
    });

    it('should make a move and X wins', function() {
      when = {
        id: "123456",
        comm: "MakeMove",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:19:30"
      };

      then = [{
        id: "123456",
        event: "WinningMoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:19:30"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should make a move and O wins', function() {
      given.push({
        id: "123456",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 0,
        side: 'X',
        timeStamp: "2015.05.07T09:19:30"
      });

      when = {
        id: "654321",
        comm: "MakeMove",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'O',
        timeStamp: "2015.05.07T09:19:35"
      };

      then = [{
        id: "654321",
        event: "WinningMoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'O',
        timeStamp: "2015.05.07T09:19:35"
      }];

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
        id: "123",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:19:00"
      }, {
        id: "321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 2,
        y: 0,
        side: 'O',
        timeStamp: "2015.05.07T09:19:05"
      }, {
        id: "1234",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 0,
        y: 1,
        side: 'X',
        timeStamp: "2015.05.07T09:19:10"
      }, {
        id: "4321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 0,
        y: 0,
        side: 'O',
        timeStamp: "2015.05.07T09:19:15"
      }, {
        id: "12345",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 1,
        y: 0,
        side: 'X',
        timeStamp: "2015.05.07T09:19:20"
      }, {
        id: "54321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 2,
        y: 1,
        side: 'O',
        timeStamp: "2015.05.07T09:19:25"
      }, {
        id: "123456",
        event: "MoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 2,
        y: 2,
        side: 'X',
        timeStamp: "2015.05.07T09:19:30"
      }, {
        id: "654321",
        event: "MoveMade",
        gameId: "13",
        userName: "Gummi",
        name: "InitialGame",
        x: 1,
        y: 2,
        side: 'O',
        timeStamp: "2015.05.07T09:19:35"
      }];

      when = {
        id: "1234567",
        comm: "MakeMove",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 0,
        y: 2,
        side: 'X',
        timeStamp: "2015.05.07T09:19:40"
      };

      then = [{
        id: "1234567",
        event: "DrawMoveMade",
        gameId: "13",
        userName: "Agirmar",
        name: "InitialGame",
        x: 0,
        y: 2,
        side: 'X',
        timeStamp: "2015.05.07T09:19:40"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });
});