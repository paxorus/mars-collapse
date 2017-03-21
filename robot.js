function Robot(team){
	this.team = team;
	var div = $("<div>", {class: team });
	var healthBar = $("<div>",{class: "health"});
	this.view = div;
	healthBar.css({width: 50, height: 7});
 	div.append(healthBar);

 	this.health = 50;
	if(team == 'civ1'){
		div.css({top: 200, left: (450 - Math.random() * 300)});
	}else{
		div.css({top: 750, left: (550 - Math.random() * 300)});
	}

	$(document.body).append(div);
	this.counter = 0;
	this.fighting = null;
	
	this.damage = function (deltaHealth) {
		this.health += deltaHealth;
		healthBar.width(this.health);
	};
	// this.getLeft = function (){
	// 	return this.domElement.get(0).style.left;
	// }();

	// this.getTop = function (){
	// 	return this.domElement.get(0).style.top;
	// }();

		
	// function setLeft(num){
	// 	this.domElement.get(0).style.left = num;

	// }

	// function setTop(num){
	// 	this.domElement.get(0).style.top = num;

	// }
}

// 






// methods for entities[]
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