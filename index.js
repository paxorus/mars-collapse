var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');
// var io2 = io;
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/game', function(req, res) {
	res.render('pages/game');
});

//localStorage.setItem('key', 'value');

var users = {};
var gameUsers = {};
var games = {};
var gameNum = 0;
io.on('connection', function (socket) { 
   if(socket.handshake.query.userId === "nil"){
		socket.emit('other users', Object.keys(users));
		var name  = "user" + Math.floor(Math.random() * 1000);
		socket.emit('uuid', name);
		// socket.emit('cookie storage', playerCount);
		for (var key in users){
			users[key].emit("other users", [name]);
		}
		users[name] = socket;

		// socket.on('name change', function(newName){
		// 	if(newName in users){
		// 		socket.emit("status", "failure");
		// 		return;
		// 	}
		// 	delete users[name];
		// 	users[newName] = socket;
		// 	name = newName;
		// 	socket.emit("status", "success");
			
		// });

		socket.on('war request', function(request){
			// console.log("2nd print == ");
			// console.log(localStorage);
			if(!(request.name in users)){
				return;
			}
			var requested = users[request.name];
			request = {name: name}; 
			requested.emit("war request",request);

		});

		socket.on('acceptance', function(acceptance){
			if(!(acceptance.name in users)){
				return;
			}
			socket.emit("start game", 1);
			var guy = users[acceptance.name];
			guy.emit("start game", 2);
			games[gameNum] = [name,acceptance.name];
			gameNum += 1;

		});	

		console.log('a user connected');

		socket.on('disconnect', function () {
			console.log('a user disconnected');
			delete users[name];

		});

	 }else{
	 	// console.log("query::")
	 	// console.log(socket.handshake.query)
	 	
	 	var player = socket.handshake.query.userId;
	 	gameUsers[player] = socket;
	 	var civNum = determineCiv(player);
	 	var enemyId = determineEnemy(player);
	 	
	 	socket.emit("decide civ", civNum);
		
		socket.on('new movement', function(mover){
			if(gameUsers[enemyId] == null){
				return;
			}
			var socketEnemy = gameUsers[enemyId];
			socketEnemy.emit('apply new movement', mover); 
			
		});

	 }




});

//check wether the user is in the first position, or in the second position of the games hash
function determineCiv(player){
	for(var key in games){
		if(player === games[key][0]){
			return 1;
		}if(player === games[key][1]){
		    return 2;
		}

	} 
}
//obtain the socket of the enemy, (in order to send him data about your moves when playing the game)
function determineEnemy(player){
	for(var key in games){
		if(player === games[key][0]){
			return games[key][1];
		}if(player === games[key][1]){
			return games[key][0];
		}

	}
}

	
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