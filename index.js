var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
	
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

var users = {};
io.on('connection', function (socket) {
	socket.emit('other users', Object.keys(users));
	var name  = "user" + Math.floor(Math.random() * 1000);
	socket.emit('uuid', name);
	for (var key in users){
		users[key].emit("other users", [name]);
	}
	users[name] = socket;

	socket.on('name change', function(newName){
		if(newName in users){
			socket.emit("status", "failure");
			return;
		}
		delete users[name];
		users[newName] = socket;
		name = newName;
		socket.emit("status", "success");
		
	});

	socket.on('war request', function(request){
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
	
	});	


	// app.get('/game', function(req, res) { 
	// res.sendFile(__dirname + '/game.html');
	// });


		
		// var guy = users[acceptance.name];
		// guy.emit("start game", 2);
		// var game = new Game(socket,guy);

	


	console.log('a user connected');

	socket.on('disconnect', function () {
		console.log('a user disconnected');
		delete users[name];

	});

});


http.listen(5000, function () {
	console.log('Node is listening on port 5000');
});