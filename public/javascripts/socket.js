/**
 * Handle client-side socket transmission/reception.
 *
 * @author Tristan, Prakhar
 */
var My = {};
var socket = io("/game");
socket.emit('entry', localStorage.entryToken);

socket.on('civ number', function (civNumber) {
	My.TEAM = "civ" + civNumber;
	startCivs(My.TEAM);
});

socket.on('create', deserialize);
socket.on('update health', deserializeHealth);
socket.on('update location', deserializeLocation);

function serialize(entity) {
	var data = {
		type: entity.type,
		team: entity.team,
		position: entity.view.position(),
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

function serializeHealth(id, deltaHealth) {
	return {
		id: id,
		deltaHealth: deltaHealth
	};
}

function deserializeHealth(data) {
	var entity = Entities.lookup(data.id);
	// soft applyHealth()
	entity.applyHealth(data.deltaHealth, true);
}

function serializeLocation(id, deltaX, deltaY) {
	return {
		id: id,
		deltaX: deltaX,
		deltaY: deltaY
	}
}

function deserializeLocation(data) {
	var entity = Entities.lookup(data.id);
	// soft shift()
	entity.shift(data.deltaX, data.deltaY, true);
}