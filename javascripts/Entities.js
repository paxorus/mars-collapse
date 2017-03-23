function EntitiesTemplate() {
	this.get = function (jqueryObject) {
		var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.length; i ++) {
			if (domElement == this[i].view.get(0)) {
				return this[i];
			}
		}
	},

	this.remove = function(entity){
		for(var i= 0; i < this.length; i++){
			var arrElement = this[i];
			if(arrElement == entity){
				this.splice(i,1)
			}
		}

	},

	this.isEnemy = function (x, y) {
		return "team" in x && "team" in y && x.team != y.team;
	}
};

EntitiesTemplate.prototype = [];
var Entities = new EntitiesTemplate();