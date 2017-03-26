/**
 * Entities manages all Entity instances and also provides several utility methods.
 *
 * @author Tristan, Cuimei, Prakhar
 */
class EntitiesPrototype extends Array {
	get(jqueryObject) {
		var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.length; i ++) {
			if (domElement == this[i].view.get(0)) {
				return this[i];
			}
		}
		return null;
	}

	remove(entity) {
		for (var i = 0; i < this.length; i ++) {
			if (this[i] == entity) {
				this.splice(i, 1);
			}
		}
	}

	isEnemy(x, y) {
		return x instanceof Entity && y instanceof Entity && x.team != y.team;
	}

	is(entity, type) {
		return entity instanceof Entity && entity.type == type;
	};

	myRobot(entity) {
		return entity instanceof Robot && entity.team == "civ1";
	};

	distance(player, entity) {
		var playerX = (player.view.position().left + player.view.width() / 2);
		var playerY = (player.view.position().top + player.view.height() / 2);
		var entityX = (entity.view.position().left + entity.view.width() / 2);
		var entityY = (entity.view.position().top + entity.view.height() / 2);
		return Util.distance(entityX - playerX, entityY - playerY);
	}
};
var Entities = new EntitiesPrototype();