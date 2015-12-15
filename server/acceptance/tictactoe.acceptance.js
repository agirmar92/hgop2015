'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;
var given = require('../fluid-api/tictactoeFluidApi').given;
var user = require('../fluid-api/tictactoeFluidApi').user;


describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    /*jshint -W030 */
    acceptanceUrl.should.be.ok;
  });

  it('Should execute same test using old style', function (done) {

    var command = {
      id : "1234",
      gameId : "999",
      comm: "CreateGame",
      user: {
      	userName: "Gulli",
      	side: "X"
      },
      name: "TheFirstGame",
      timeStamp: "2014-12-02T11:29:29"
    };

    var req = request(acceptanceUrl);
    req
      .post('/api/createGame')
      .type('json')
      .send(command)
      .end(function (err, res) {
        if (err) return done(err);
        request(acceptanceUrl)
          .get('/api/gameHistory/999')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            should(res.body).eql(
              [{
                "id": "1234",
                "gameId": "999",
                "event": "GameCreated",
                "user": {
                	"userName": "Gulli",
                	"side": "X"	
                },
                "name": "TheFirstGame",
                "timeStamp": "2014-12-02T11:29:29"
              }]);
            done();
          });
      });
  });

	it('Should execute fluid API test - same as above', function (done) {
		var player1 = {
			userName: "Siggi",
			side: "X"
		};
		var gameName = "ElitesOnly";
		var gameId = "555";

		given(
			user(player1).createsGame(gameName).withId(gameId)
		).expect("GameCreated").withName(gameName).isOk(done);
	});

	it('Should create a game and player joins', function (done) {
		var player1 = {
			userName: "Danny",
			side: "X"
		};
		var player2 = {
			userName: "Sebastian",
			side: "O"
		};
		var gameName = "GreatestGameEver";
		var gameId = "684";

		given(
			user(player1).createsGame(gameName).withId(gameId)
			.and(player2).joinsGame(gameName).withId(gameId)
		).expect("GameJoined")
		.byUser(player2)
		.isOk(done);
	});

	it('Should play a game until drawn', function (done) {
		var player1 = {
			userName: "John",
			side: "X"
		};
		var player2 = {
			userName: "Matthew",
			side: "O"
		};
		var gameName = "I am undefeated";
		var gameId = "122";

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
		).expect("MovePlaced")
		.byUser(player1)
		.withCoordinates(0,2)
		.withSymbol('X')
		.and("GameDraw")
		.isOk(done);
	});
});
