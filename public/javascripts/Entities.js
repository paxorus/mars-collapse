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

	get(mesh) {
		// clicking accessories should select main object
		// while (!jqueryObject.parent().is("body")) {
		// 	jqueryObject = jqueryObject.parent();
		// }
		// console.log(mesh);
		for (var i = 0; i < this.length; i ++) {
			if (mesh == this[i].view) {
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

	isEntity(x) {
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

	distance(entity1, entity2) {
		
		var ent1X = entity1.view.position['x'];
		var ent1Z = entity1.view.position['z'];
		var ent2X = entity2.view.position['x'];
		var ent2Z = entity2.view.position['z'];
		var playerX 
		// //var robotRadius = player.view.geometry.boundingSphere.radius;
		// var playerX = (player.view.position.x + robotRadius);
		// var playerZ = (player.view.position.z + robotRadius);
		// var entityX = (entity.view.position.x + 0 / 2);
		// var entityZ = (entity.view.position.z + 0 / 2);// entity.view.height() 
		return Util.distance(ent1X - ent2X, ent1Z - ent2Z);
	}
};
var Entities = new EntitiesPrototype();