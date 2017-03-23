function Entities(){

	this.get = function (jqueryObject) {
		var domElement = jqueryObject.get(0);
		for (var i = 0; i < this.length; i ++) {
			if (domElement == this[i].domElement.get(0)) {
				return this[i];
			}
		}
	};
}

Entities.prototype = [];