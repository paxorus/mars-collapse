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
socket.on('remove', softRemove);

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

function softRemove(data) {
	var entity = Entities.lookup(data.id);
	// soft die
	entity.view.remove();
	Entities.softRemove(entity);
	if (this == selectedObject) {
		selectedObject = null;
		Profile.clear();
	}
}