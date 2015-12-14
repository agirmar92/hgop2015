var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

var given = function(commands) {

	//console.log(commands);

	var currEvent = 0;
	var currExpect = 0;
	
	var cmd = commands.returnValue[currEvent].data;

	var expectations = [{
		id: cmd.id,
		gameId: cmd.gameId,
		event: "",
		userName: cmd.userName,
		name: cmd.name,
		timeStamp: cmd.timeStamp
	}];

	var executeCommand = function(done, callback) {
		// Logic goes here
		var req = request(acceptanceUrl);
		//console.log("about to execute:");
		//console.log(cmd);
		req
			.post(commands.returnValue[currEvent].destination)
			.type('json')
			.send(cmd)
			.end(function(err, res) {
				if (err) return done(err);

				currEvent++;

				if (currEvent !== commands.returnValue.length) {
					// Execute next command
					callback(done);
				} else {
					// Modifying the expectations, to something that should be the same as the command
					expectations[currExpect].timeStamp = cmd.timeStamp;
					expectations[currExpect].userName = cmd.userName;
					expectations[currExpect].name = cmd.name;
					expectations[currExpect].id = cmd.id;

					// All commands have been executed, now assert
					should(res.body).eql(expectations);
					done();
				}
			});
	};
	
	var givenApi = {

		expect: function(eventValue) {
			expectations[currExpect].event = eventValue;
			return givenApi;
		},

		withName: function(name) {
			expectations[currExpect].name = name;
			return givenApi;
		},

		byUser: function(username) {
			expectations[currExpect].userName = username;
			return givenApi;
		},

		withOtherUser: function(username) {
			expectations[currExpect].otherUserName = username;
			return givenApi;
		},

		isOk: function(done) {
			cmd = commands.returnValue[currEvent].data;
			executeCommand(done, this.isOk);
		}
	}

	return givenApi;
}

var user = function(userName) {

	var command  = {};
	var commands = [];

	var userApi = {
		returnValue: [],

		and: function(userName) {
			command = {};
			return userApi;
		},

		createsGame: function(gameName) {
			command = {
				data: {
					id: "1234",
					gameId: "",
					comm: "CreateGame",
					userName: userName,
					name: gameName,
					timeStamp: "2015-12-02T11:11:29"
				},
				destination: "/api/createGame"
			};

			return userApi;
		},

		joinsGame: function(gameName) {
			command = {
				data: {
					id: "9876",
					comm: "JoinGame",
					gameId: "",
					userName: userName,
					name: gameName,
					timeStamp: "2015.05.07T09:17:35"
				},
				destination: "/api/joinGame"
			};

			return userApi;
		},

		makesMove: function(x, y) {
			//
			return userApi;
		},

		withId: function(id) {
			command.data.gameId = id;
			commands.push(command);
			this.returnValue = commands;

			return userApi;
		}
	};

	return userApi;
}

module.exports.given = given;
module.exports.user = user;