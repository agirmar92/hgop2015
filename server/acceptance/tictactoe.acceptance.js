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


   it('Should execute fluid API test', function (done) {
     
     given(user("Agirmar").createsGame("BestGameEver"))
     .expect("GameCreated").withName("BestGameEver").isOk(done);
      
     //done();
   });

	var given = function(command) {

		var cmd = command;
		var response = {};
		var toCheck = {
			key: "",
			value: ""
		};
		
		var givenApi = {
			expect: function(event) {
				response = event;
				return givenApi;
			},

			withName: function(gameName) {
				toCheck.key = "name";
				toCheck.value = gameName;
				return givenApi;
			},

			isOk: function(done) {
				// logic goes here
				var req = request(acceptanceUrl);
				req
					.post('/api/createGame')
					.type('json')
					.send(cmd)
					.end(function (err, res) {
						if (err) return done(err);
						request(acceptanceUrl)
						.get('/api/gameHistory/555')
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) return done(err);
							should(res.body[0].name).eql("BestGameEver");
							done();
						});
					});
			}
		}

		return givenApi;
	}

	var user = function(userName) {

		var cmdInfo = {};

		var userApi = {
			createsGame: function(gameName) {
				return {
					id: "1234",
					gameId: "555",
					comm: "CreateGame",
					userName: userName,
					name: gameName,
					timeStamp: "2015-12-02T11:11:29"
				}
			}
		}

	   return userApi;
	}

});
