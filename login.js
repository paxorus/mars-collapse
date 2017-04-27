var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

var allPlayer = [];
var allSocket = [];
io.on('connection', function(socket){
	var playerId = Math.floor(Math.random()*100);
	io.emit('registerPlayer', playerId);
	allPlayer.push(playerId);
	allSocket.push(socket);
	for(var i = 0; i < allSocket - 1.length; i++) {
		io.emit('registerPlayer', playerId);
	}
	console.log('a user connected');
  	// socket.on(function(players){
	    // console.log('player: ' + playerId);

	    //io.emit('registerPlayer', playerId);
  	// });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});