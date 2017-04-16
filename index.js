/**
 * Node.js server script.
 *
 * @author Tristan, Prakhar
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/game', function(req, res) {
	res.render('pages/game');
});

var users = {};// user to socket
// var civ1Players = new Set();
var opponentOf = {};// user to opponent
var tokenMap = {};// token to user

io.of('/index').on('connection', function (socket) {
	console.log('connected to /index');

	socket.emit('insert users', Object.keys(users));
	var name = "user" + generateUuid();
	socket.emit('uuid', name);
	users[name] = socket;
	socket.broadcast.emit('insert users', [name]);

	socket.on('name change', function(newName){
		if(newName in users) {
			socket.emit('status', "failure");
			return;
		}
		if (newName === "" || newName.includes(" ")) {
			// silently exit
			return;
		}

		// update hash and emit success
		var staleName = name;
		name = newName;

		delete users[staleName];
		users[newName] = socket;
		socket.emit('status', "success");
		socket.broadcast.emit('update user', {stale: staleName, fresh: newName});
	});

	socket.on('war request', function (request) {
		if(!(request.name in users)){
			return;
		}
		// transmit request
		var requested = users[request.name];
		request = {name: name}; 
		requested.emit("war request", request);
	});

	socket.on('cancel request', function (request) {
		if(!(request.name in users)){
			return;
		}
		// transmit request
		var requested = users[request.name];
		request = {name: name}; 
		requested.emit("cancel request", request);
	});

	socket.on('acceptance', function (acceptance) {
		var acceptor = acceptance.name;
		if(!(acceptor in users)) {
			return;
		}
		// Entry tokens are UUIDs that convey whether the player is civ1 or civ2.
		// Since the tokens are stored client-side for persistence across pages,
		// it is important to mask the role from the user until they assume it.

		// create entry tokens
		var entryTokens = [generateUuid(), generateUuid()];
		var guy = users[acceptor];

		// sockets point to each other
		opponentOf[name] = acceptor;
		opponentOf[acceptor] = name;

		console.log(name + " accepted " + acceptance.name);

		// launch game for both users
		socket.emit("start game", entryTokens[0]);
		tokenMap[entryTokens[0]] = name;
		guy.emit("start game", entryTokens[1]);
		tokenMap[entryTokens[1]] = acceptor;
	});

	socket.on('disconnect', function () {
		console.log('disconnected from /index');
		delete users[name];
		socket.broadcast.emit("delete user", name);
	});
});

io.of('/game').on('connection', function (socket) {
	console.log('connected to /game');

	socket.on('entry', function (entryToken) {
		var name = tokenMap[entryToken];
		delete tokenMap[entryToken];
		users[name] = socket;

		if (!(opponentOf[name] in users)) {
			return;
		}

		// both players have connected, link them
		var socket2 = users[opponentOf[name]];
		socket2.opponent = socket;
		socket.opponent = socket2;

		var civNumber = (Math.random() < 0.5) + 1;
		socket.emit('civ number', civNumber);
		socket2.emit('civ number', 3 - civNumber);
	});

	socket.on('create', function (data) {
		socket.opponent.emit('create', data);
	});

	socket.on('update health', function (data) {
		socket.opponent.emit('update health', data);
	});

	socket.on('update location', function (data) {
		socket.opponent.emit('update location', data);
	});

	socket.on('disconnect', function () {
		console.log('disconnected from /game');
	});
});

function generateUuid() {
	// TODO
	return Math.floor(Math.random() * 1e9);
}



http.listen(5000, function () {
	console.log('Node is listening on port 5000');
});