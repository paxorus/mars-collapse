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
}
