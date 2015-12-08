var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', function() {
  var given, when, then;

  it('should create game', function() {
    given = [];
    when = {
      id: "987",
      comm: "CreateGame",
      userName: "Agirmar",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:15:22"
    };
    then = [{
      id: "987",
      event: "GameCreated",
      userName: "Agirmar",
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
      comm: "CreateGame",
      userName: "SiggiHall",
      name: "TheBestGame",
      timeStamp: "2015.05.07T11:15:22"
    };
    then = [{
      id: "789",
      event: "GameCreated",
      userName: "SiggiHall",
      timeStamp: "2015.05.07T11:15:22",
      name: "TheBestGame"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
