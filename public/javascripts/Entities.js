/**
 * Entities manages all Entity instances and also provides several utility methods.
 *
 * @author Tristan, Jasmine, Prakhar
 */
class EntitiesPrototype extends Array {

	constructor() {
		super();
		// TODO: garbage collect the map
		this._map = {};
	}

	get(threeJsObject) {
		// clicking accessories should select main object
		// while (!jqueryObject.parent().is("body")) {
		// 	jqueryObject = jqueryObject.parent();
		// }
		var selectedMesh = threeJsObject.object;
		//debugger
		//var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.length; i ++) {
			if (selectedMesh == this[i].view) {
				return this[i];
			}
		}
		return null;
	}

	push(entity) {
		super.push(entity);
		this._map[entity._id] = entity;
		if (entity.team == My.TEAM) {
			socket.emit('create', serialize(entity));
		}
	}

	remove(entity) {
		for (var i = 0; i < this.length; i ++) {
			if (this[i] == entity) {
				this.splice(i, 1);
			}
		}
	}

	lookup(id) {
		return this._map[id];
	}

	isEntity(x){
		return x instanceof Entity;
	}

	isEnemy(x, y) {
		// true for opposite team and aliens, false for mines
		return x instanceof Attackable && y instanceof Attackable && x.team != y.team;
	}

	is(x, type) {
		return x instanceof Entity && x.type == type;
	}

	myRobot(x) {
		return x instanceof Robot && x.team == My.TEAM;
	}

	distance(player, entity) {
		var playerX = (player.view.position().left + player.view.width() / 2);
		var playerY = (player.view.position().top + player.view.height() / 2);
		var entityX = (entity.view.position().left + entity.view.width() / 2);
		var entityY = (entity.view.position().top + entity.view.height() / 2);
		return Util.distance(entityX - playerX, entityY - playerY);
	}
};
var Entities = new EntitiesPrototype();