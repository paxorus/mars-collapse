/**
 * Handle client-side socket transmission/reception.
 *
 * @author Tristan, Prakhar
 */

var My = {};
var socket = io("/game");
socket.emit('entry', sessionStorage.entryToken);

socket.on('civ number', function (civNumber) {
	My.TEAM = "civ" + civNumber;
	startCivs(My.TEAM);
});

socket.on('create', deserialize);

// Remote Entities.push()
function serialize(entity) {
	var data = {
		type: entity.type,
		team: entity.team,
		position: entity.view.position,
		id: entity._id
	};
	if (entity instanceof Mine) {
		data.num = entity.health;
	}
	if (entity instanceof CivBase) {
		data.status = entity.status;
	}
	return data;
}

function deserialize(data) {
	var entity;
	switch (data.type) {
		case "CivBase":
			entity = new CivBase(data.team, data.position);
			if (data.status == "initial") {
				entity.quickstart();
			}
			break;
		case "Factory":
			entity = new Factory(data.team, data.position);
			break;
		case "Mine":
			entity = new Mine(data.num);
			entity.view.css(data.position);
			break;
		case "Robot":
			entity = new Robot(data.team, data.position);
			break;
		case "Turret":
			entity = new Turret(data.team, data.position);
			break;
		default:
			console.warn("Invalid packet", data);
			return;
	}
	entity._id = data.id;
	Entities.push(entity);
}

// Remote Entity.applyHealth()
function serializeHealth(id, deltaHealth) {
	return {
		id: id,
		deltaHealth: deltaHealth
	};
}

socket.on('health', function (data) {
	var entity = Entities.lookup(data.id);
	entity.applyHealth(data.deltaHealth, true);
});


// Remote Robot.shift()
function serializeLocation(id, deltaX, deltaY) {
	return {
		id: id,
		deltaX: deltaX,
		deltaY: deltaY
	}
}

socket.on('location', function (data) {
	var entity = Entities.lookup(data.id);
	entity.shift(data.deltaX, data.deltaY, true);
});


// Remote Building.start()
function serializeStatus(id) {
	return {
		id: id
	};
}

socket.on('start construction', function (data) {
	var entity = Entities.lookup(data.id);
	entity.start(true);
});


// Remote Building.build()
function serializeBuild(id, deltaProgress) {
	return {
		id: id,
		deltaProgress: deltaProgress
	};
}

socket.on('build', function (data) {
	var entity = Entities.lookup(data.id);
	entity.build(data.deltaProgress, true);
});


// Remote Mine.mining()
function serializeMine(id, deltaProgress) {
	return {
		id: id,
		deltaProgress: deltaProgress
	};
}

socket.on('mine', function (data) {
	var entity = Entities.lookup(data.id);
	entity.mining(data.deltaProgress, true);
});
