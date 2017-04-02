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
		// true for opposite team and aliens, false for mines
		return x instanceof Attackable && y instanceof Attackable && x.team != y.team;
	}

	is(x, type) {
		return x instanceof Entity && x.type == type;
	};

	myRobot(x) {
		return x instanceof Robot && x.team == "civ1";
	};

	// allMines(x) {
	// 	return x instanceof Mine && x.hasMinerals > 0;
	// };

	distance(player, entity) {
		var playerX = (player.view.position().left + player.view.width() / 2);
		var playerY = (player.view.position().top + player.view.height() / 2);
		var entityX = (entity.view.position().left + entity.view.width() / 2);
		var entityY = (entity.view.position().top + entity.view.height() / 2);
		return Util.distance(entityX - playerX, entityY - playerY);
	}
};
var Entities = new EntitiesPrototype();