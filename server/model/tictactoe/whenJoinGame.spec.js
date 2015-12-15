var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('join game command', function() {

  var given, when, then;

  it('should join game',function() {
    given = [{
      id: "987",
      event: "GameCreated",
      gameId: "1212",
      user: {
        userName: "Agirmar",
        side: "X"
      },
      timeStamp: "2015.05.07T09:15:22",
      name: "InitialGame"
    }];
    when = {
      id: "9876",
      comm: "JoinGame",
      gameId: "1212",
      user: {
        userName: "Gummi",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:35"
    };
    then = [{
      id: "9876",
      event: "GameJoined",
      gameId: "1212",
      user: {
        userName: "Gummi",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:35"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should reject joining of a non-existing game', function() {
    given = [];
    when = {
      id: "9876",
      comm: "JoinGame",
      gameId: "12",
      user: {
        userName: "Gummi",
        side: "O"
      },
      name: "InitialGame",
      timeStamp: "2015.05.07T09:17:35"
    };
    then = [{
      id: "9876",
      event: "GameDoesNotExist",
      gameId: "12",
      user: {
        userName: "Gummi",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:35"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should reject joining a full game', function() {
    given = [{
      id: "987",
      event: "GameCreated",
      gameId: "10",
      user: {
        userName: "Agirmar",
        side: "X"
      },
      timeStamp: "2015.05.07T09:15:22",
      name: "InitialGame"
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
    when = {
      id: "987654",
      comm: "JoinGame",
      gameId: "10",
      user: {
        userName: "Bjarni",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:45"
    };
    then = [{
      id: "987654",
      event: "GameIsFull",
      gameId: "10",
      user: {
        userName: "Bjarni",
        side: "O"
      },
      timeStamp: "2015.05.07T09:17:45"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
