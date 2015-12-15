var user = require('../fluid-api/tictactoeFluidApi').user;
var given = require('../fluid-api/tictactoeFluidApi').given;

it('Should play 200 games in 8 seconds.', function (done) {
  var doneCount = 0;
  var gamesToPlay = 200;
  var x = 8;

  this.timeout(x * 1000);

  var QED = function () {
    if (gamesToPlay === ++doneCount) {
      done();
    }
  };

  for (var gameId = 0; gameId < gamesToPlay; gameId++) {
    var player1 = "TestUserOne";
    var player2 = "TestUserTwo";
    var gameName = "Game number " + gameId;

    given(
      user(player1).createsGame(gameName).withId(gameId)
      .and(player2).joinsGame(gameName).withId(gameId)
      .and(player1).makesMove(1,1,'X')
      .and(player2).makesMove(2,0,'O')
      .and(player1).makesMove(0,1,'X')
      .and(player2).makesMove(0,0,'O')
      .and(player1).makesMove(1,0,'X')
      .and(player2).makesMove(2,1,'O')
      .and(player1).makesMove(2,2,'X')
      .and(player2).makesMove(1,2,'O')
      .and(player1).makesMove(0,2,'X')
    ).expect("DrawMoveMade")
    .byUser(player1)
    .withCoordinates(0,2)
    .withSymbol('X')
    .isOk(QED);
  }
});