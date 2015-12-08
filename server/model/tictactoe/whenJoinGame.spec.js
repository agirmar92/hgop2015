var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('join game command', function() {

  var given, when, then;

  it('should join game',function() {
    given = [{
      id: "987",
      event: "GameCreated",
      userName: "Agirmar",
      timeStamp: "2015.05.07T09:15:22",
      name: "InitialGame"
    }];
    when = {
      id: "9876",
      comm: "JoinGame",
      userName: "Gummi",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:17:35"
    };
    then = [{
      id: "9876",
      event: "GameJoined",
      userName: "Gummi",
      otherUserName: "Agirmar",
      name: "InitialGame",
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
      userName: "Gummi",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:17:35"
    };
    then = [{
      id: "9876",
      event: "GameDoesNotExist",
      name: "InitialGame",
      userName: "Gummi",
      timeStamp: "2015.05.07T09:17:35"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should reject joining a full game', function() {
    given = [{
      id: "987",
      event: "GameCreated",
      userName: "Agirmar",
      timeStamp: "2015.05.07T09:15:22",
      name: "InitialGame"
    }, {
      id: "9876",
      event: "GameJoined",
      userName: "Gummi",
      otherUserName: "Agirmar",
      timeStamp: "2015.05.07T09:17:35"
    }];
    when = {
      id: "987654",
      comm: "JoinGame",
      userName: "Bjarni",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:17:45"
    };
    then = [{
      id: "987654",
      event: "GameIsFull",
      userName: "Bjarni",
      name: "InitialGame",
      timeStamp: "2015.05.07T09:17:45"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
