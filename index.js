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

var users = {};
// var gameUsers = {};
// var games = {};

io.of('/index').on('connection', function (socket) {
	console.log('connected to /index');

	socket.emit('insert users', Object.keys(users));
	var name = "user" + generateUuid();
	socket.emit('uuid', name);
	users[name] = socket;
	socket.broadcast.emit('insert users', [name]);

	socket.on('name change', function(newName){
		if(newName in users){
			socket.emit('status', "failure");
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

	socket.on('war request', function(request){
		if(!(request.name in users)){
			return;
		}
		// transmit request
		var requested = users[request.name];
		request = {name: name}; 
		requested.emit("war request", request);
	});

	socket.on('acceptance', function(acceptance) {
		if(!(acceptance.name in users)) {
			return;
		}
		// launch game for both users
		socket.emit("start game", 1);
		var guy = users[acceptance.name];
		guy.emit("start game", 2);
		console.log(name + " accepted " + acceptance.name);

		// create game, map user ids to game
		// send entry tokens
		// games[gameNum] = [name,acceptance.name];
		// gameNum += 1;
	});

	socket.on('disconnect', function () {
		console.log('disconnected from /index');
		delete users[name];
		socket.broadcast.emit("delete user", name);
	});
});

io.of('/game').on('connection', function (socket) {
	console.log('connected to /game');

	socket.on('entry', function () {
		// look up whether in player1 set
	});

 	// // var player = socket.handshake.query.userId;
 	// gameUsers[player] = socket;
 	// var civNum = determineCiv(player);
 	// var enemyId = determineEnemy(player);
 	
 	// socket.emit("decide civ", civNum);
	
	socket.on('new movement', function(mover){
		if(gameUsers[enemyId] == null){
			return;
		}
		var socketEnemy = gameUsers[enemyId];
		socketEnemy.emit('apply new movement', mover); 
	});

	socket.on('disconnect', function () {
		console.log('disconnected from /game');
	});
});

function generateUuid() {
	// TODO
	return Math.floor(Math.random() * 1000);
}

// //check wether the user is in the first position, or in the second position of the games hash
// function determineCiv(player){
// 	for(var key in games){
// 		if(player === games[key][0]){
// 			return 1;
// 		}if(player === games[key][1]){
// 			return 2;
// 		}
// 	} 
// }

// //obtain the socket of the enemy, (in order to send him data about your moves when playing the game)
// function determineEnemy(player){
// 	for(var key in games){
// 		if(player === games[key][0]){
// 			return games[key][1];
// 		}if(player === games[key][1]){
// 			return games[key][0];
// 		}

// 	}
// }

	
// isGameServer(){
	
// 	// for(var key in games){
// 	// 	 games[key][0] 
// 	// }
// 	if(games[0])

// }


	// player1 = [];  //array of all the player 1's and all the player 2's
	// player2 = [];
	// var num = 0;
	// io2.on('connection', function(socket){
	// 	if(num%2 == 0){
	// 		player1.push(socket);
	// 		socket.emit('deciding player number', 1);
	// 	}else{
	// 		player2.push(socket);
	// 		socket.emit('deciding player number', 2);
	// 	}
	// 	num += 1;

	// 	console.log('player connected in game server');

	// 	socket.on('disconnect', function () {
	// 		console.log('a player disconnected in game server');
	

	// 	});

	// });

		
		// var guy = users[acceptance.name];
		// guy.emit("start game", 2);
		// var game = new Game(socket,guy);

	


	


http.listen(5000, function () {
	console.log('Node is listening on port 5000');
});