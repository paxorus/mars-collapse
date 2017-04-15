/**
 * Entities manages all Entity instances and also provides several utility methods.
 *
 * @author Tristan, Jasmine, Prakhar
 */
class EntitiesPrototype extends Array {
	get(jqueryObject) {
		// clicking accessories should select main object
		while (!jqueryObject.parent().is("body")) {
			jqueryObject = jqueryObject.parent();
		}
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
	}

	myRobot(x) {
		if(playerCiv === 1){
			return x instanceof Robot && x.team == "civ1";
		}else{
			return x instanceof Robot && x.team == "civ2";
		}
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