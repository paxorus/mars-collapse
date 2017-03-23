var Entities = {
	array: [],
	push: function (x) {
		this.array.push(x);
	},
	get: function (jqueryObject) {
		var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.array.length; i ++) {
			if (domElement == this.array[i].view.get(0)) {
				return this.array[i];
			}
		}
	},

	die: function(entity){
		entity.view.remove();
		for(var i= 0; i < this.array.length; i++){
			var arrElement = this.array[i];
			if(arrElement == entity){
				this.array.splice(i,1)
			}
		}

	}
};

// function Entities(){

// 	this.get = function (jqueryObject) {
// 		var domElement = jqueryObject.get(0);
// 		for (var i = 0; i < this.length; i ++) {
// 			if (domElement == this[i].domElement.get(0)) {
// 				return this[i];
// 			}
// 		}
// 	};
// }

// Entities.prototype = [];