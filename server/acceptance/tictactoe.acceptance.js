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
		given(user("Siggi").createsGame("ElitesOnly").withId("555")).sendTo("/api/createGame").expect(200).and(/json/).when(done);
	});

	var given = function(command) {

		console.log(command);

		var cmd = command;
		var expectations = [];
		var destination;
		
		var givenApi = {
			expect: function(event) {
				expectations.push(event);
				return givenApi;
			},

			sendTo: function(dest) {
				destination = dest;
				return givenApi;
			},

			and: function(event) {
				return givenApi.expect(event);
			},

			when: function(done) {
				// Logic goes here
				var req = request(acceptanceUrl);
				req
					.post(destination)
					.type('json')
					.send(command)
					.end(function (err, res) {
						if (err) return done(err);
						request(acceptanceUrl)
						.get('/api/gameHistory/555')
						.expect(expectations[0])
						.expect('Content-Type', expectations[1])
						.end(function (err, res) {
							if (err) return done(err);
							res.body.should.be.instanceof(Array);
							should(res.body).eql(
							[{
								"id": "1234",
								"gameId": "555",
								"event": "GameCreated",
								"userName": "Siggi",
								"name": "ElitesOnly",
								"timeStamp": "2015-12-02T11:11:29"
							}]);
							done();
						});
					});
				done();
			}
		}

		return givenApi;
	}

	var user = function(userName) {

		var userApi = {
			createsGame: function(gameName) {
				var createGameApi = {
					withId: function(id) {
						return {
							id: "1234",
							gameId: id,
							comm: "CreateGame",
							userName: userName,
							name: gameName,
							timeStamp: "2015-12-02T11:11:29"
						};
					}
				};
				return createGameApi;
			}
		};

	   return userApi;
	}

});
