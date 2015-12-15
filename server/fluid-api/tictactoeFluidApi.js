var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;
var expectations = [{}];
var currExpect = 0;

var given = function(commands) {
	var currEvent = 0;
	var cmd = commands.returnValue[currEvent].data;

	var executeCommand = function(done, callback, assert) {
		// Logic goes here
		cmd = commands.returnValue[currEvent].data;
		var req = request(acceptanceUrl);
		req
			.post(commands.returnValue[currEvent].destination)
			.type('json')
			.send(cmd)
			.end(function(err, res) {
				if (err) return done(err);

				currEvent++;

				if (currEvent !== commands.returnValue.length) {
					// Execute next command
					callback(done, callback, assert);
				} else {
					// All commands have been executed, now assert
					if(assert) should(res.body).eql(expectations);
					done();
				}
			});
	};
	
	var givenApi = {

		expect: function(eventValue) {
			expectations[currExpect].event = eventValue;
			return givenApi;
		},

		and: function(eventValue) {
			var firstExpect = expectations[currExpect];
			expectations[++currExpect] = {
				event: 'GameDraw',
			    gameId: firstExpect.gameId,
			    user: firstExpect.user,
			    timeStamp: firstExpect.timeStamp
			};
			return givenApi;
		},

		withName: function(name) {
			expectations[currExpect].name = name;
			return givenApi;
		},

		byUser: function(user) {
			expectations[currExpect].user = user;
			return givenApi;
		},

		withCoordinates: function(x, y) {
			expectations[currExpect].move.x = x;
			expectations[currExpect].move.y = y;
			return givenApi;
		},

		withSymbol: function(symbol) {
			expectations[currExpect].user.side = symbol;
			return givenApi;
		},

		isOk: function(done, assert) {
			// Execute every command, with help of callbacks
			currEvent = 0;
			executeCommand(done, executeCommand, assert);
		}
	}

	return givenApi;
}

var user = function(userName) {

	var command  = {};
	var commands = [];

	var currUser = userName;

	var userApi = {
		returnValue: [],

		and: function(userName) {
			command = {};
			currUser = userName;
			return userApi;
		},

		createsGame: function(gameName) {
			command = {
				data: {
					id: "1234",
					gameId: "",
					comm: "CreateGame",
					user: currUser,
					name: gameName,
					timeStamp: "2015-12-02T11:11:29"
				},
				destination: "/api/createGame"
			};

			expectations[currExpect] = {
      		    event: "GameCreated",
				name: command.data.name,
				gameId: command.data.gameId,
				id: command.data.id,
				timeStamp: command.data.timeStamp,
				user: currUser
			};

			return userApi;
		},

		joinsGame: function(gameName) {
			command = {
				data: {
					id: "9876",
					comm: "JoinGame",
					gameId: "",
					user: currUser,
					timeStamp: "2015.05.07T09:17:35"
				},
				destination: "/api/joinGame"
			};

			expectations[currExpect] = {
				event: "GameJoined",
				gameId: "",
				id: "9876",
				user: currUser,
				timeStamp: command.data.timeStamp
			};

			return userApi;
		},

		makesMove: function(xPos, yPos, symbol) {
			var theId = commands[0].data.gameId;
			var theName = commands[0].data.name;

			command = {
				data: {
			        comm: "PlaceMove",
			        gameId: theId,
			        user: currUser,
			        move: {
				        x: xPos,
				        y: yPos
			        },
			        timeStamp: "2015.05.07T09:20:42"
				},
				destination: "/api/placeMove"
			};

			expectations[currExpect] = {
				event: "MovePlaced",
				gameId: theId,
				user: currUser,
				move: {
					x: command.data.x,
					y: command.data.y
				},
				timeStamp: command.data.timeStamp
			};

			commands.push(command);
			this.returnValue = commands;

			return userApi;
		},

		withId: function(id) {
			command.data.gameId = id;
			expectations[currExpect].gameId = id;
			commands.push(command);
			this.returnValue = commands;

			return userApi;
		}
	};

	return userApi;
}

module.exports.given = given;
module.exports.user = user;