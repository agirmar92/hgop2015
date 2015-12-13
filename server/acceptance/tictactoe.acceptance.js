'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;


describe('TEST ENV GET /api/gameHistory', function () {

  it('Should have ACCEPTANCE_URL environment variable exported.', function () {
    acceptanceUrl.should.be.ok;
  });

  it('Should execute same test using old style', function (done) {

    var command = {
      id : "1234",
      gameId : "999",
      comm: "CreateGame",
      userName: "Gulli",
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
                "userName": "Gulli",
                "name": "TheFirstGame",
                "timeStamp": "2014-12-02T11:29:29"
              }]);
            done();
          });
      });
  });

	it('Should execute fluid API test - same as above', function (done) {
		given(user("Siggi").createsGame("ElitesOnly").withId("555")).expect("GameCreated").withName("ElitesOnly").isOk(done);
	});

	it('Should play a game until drawn', function (done) {
		var player1 = "John";
		var player2 = "Matthew";

		given(
			user(player1).createsGame("I am undefeated").withId("12")
			.and(player2).joinGame("12")
			.and(player1).makesMove(1,1)
			.and(player2).makesMove(2,0)
			.and(player1).makesMove(0,1)
			.and(player2).makesMove(0,0)
			.and(player1).makesMove(1,0)
			.and(player2).makesMove(2,1)
			.and(player1).makesMove(2,2)
			.and(player2).makesMove(1,2)
		).expect("DrawModeMade").byUser(player2)
		.isOk(done);
	});

	var given = function(command) {

		var cmd = command;
		var expectations = [];
		
		var givenApi = {
			expect: function(eventValue) {
				expectations.push({
					key: "event",
					value: eventValue
				});

				return givenApi;
			},

			and: function(event) {
				return givenApi.expect(event);
			},

			withName: function(name) {
				expectations.push({
					key: "name",
					value: name
				});

				return givenApi;
			},

			isOk: function(done) {
				// Logic goes here
				var req = request(acceptanceUrl);
				req
					.post(command.destination)
					.type('json')
					.send(command.data)
					.end(function(err, res) {
						if (err) return done(err);
						for (var i = 0; i < expectations.length; i++) {
							var currKey = expectations[i].key;
							var currValue = expectations[i].value;

							if (currKey === "event")
								should(res.body[0].event).eql(currValue);
							else if (currKey === "name")
								should(res.body[0].name).eql(currValue);
						}

						done();
					});
			}
		}

		return givenApi;
	}

	var user = function(userName) {

		var userApi = {
			createsGame: function(gameName) {

				var createCommand = {
					data: {
						id: "1234",
						gameId: "",
						comm: "CreateGame",
						userName: userName,
						name: gameName,
						timeStamp: "2015-12-02T11:11:29"
					},
					destination: "/api/createGame"
				}

				var createGameApi = {
					withId: function(id) {
						createCommand.data.gameId = id;
						return createCommand;
					}
				};

				return createGameApi;
			}
		};

	   return userApi;
	}

});
