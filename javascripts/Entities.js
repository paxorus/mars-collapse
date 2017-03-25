function EntitiesTemplate() {
	this.get = function (jqueryObject) {
		var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.length; i ++) {
			if (domElement == this[i].view.get(0)) {
				return this[i];
			}
		}
		return null;
	},

	this.remove = function(entity){
		for(var i= 0; i < this.length; i++){
			var arrElement = this[i];
			if(arrElement == entity){
				this.splice(i,1);
			}
		}
	},

	this.isEnemy = function (x, y) {
		return "team" in x && "team" in y && x.team != y.team;
	};

	this.is = function (entity, type) {
		return entity !== null && entity.type == type;
	};

	this.distance = function (player, entity) {
		var playerX = (player.view.position().left + player.view.width() / 2);
		var playerY = (player.view.position().top + player.view.height() / 2);
		var entityX = (entity.view.position().left + entity.view.width() / 2);
		var entityY = (entity.view.position().top + entity.view.height() / 2);
		return Util.distance(entityX - playerX, entityY - playerY);
	}
};

EntitiesTemplate.prototype = [];
var Entities = new EntitiesTemplate();