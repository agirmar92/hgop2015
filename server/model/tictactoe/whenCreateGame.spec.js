var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', function() {
  var given, when, then;

  it('should create game', function() {
    given = [];
    when = {
      id: "987",
      gameId: "1",
      comm: "CreateGame",
      user: {
        userName: "Agirmar",
        side: "X"
      },
      name: "InitialGame",
      timeStamp: "2015.05.07T09:15:22"
    };
    then = [{
      id: "987",
      event: "GameCreated",
      gameId: "1",
      user: {
        userName: "Agirmar",
        side: "X"
      },
      timeStamp: "2015.05.07T09:15:22",
      name: "InitialGame"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should create game with another user another time', function() {
    given = [];
    when = {
      id: "789",
      gameId: "2",
      comm: "CreateGame",
      user: {
        userName: "SiggiHall",
        side: "X"
      },
      name: "TheBestGame",
      timeStamp: "2015.05.07T11:15:22"
    };
    then = [{
      id: "789",
      event: "GameCreated",
      gameId: "2",
      user: {
        userName: "SiggiHall",
        side: "X"
      },
      timeStamp: "2015.05.07T11:15:22",
      name: "TheBestGame"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
