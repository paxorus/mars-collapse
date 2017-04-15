var socket;

function assignSocket(socket){
	var socket = socket;

}

function sendMovementSocket(mover){
	socket.emit('new movement', mover);

}


function setNewPosition(mover){
	// entity = Entities.get(mover); //make sure that mover is a jquery object
	// entity.view.css({
	// 	left: mover.view.position().left;
	// 	top: mover.view.position().top;
	// });
}