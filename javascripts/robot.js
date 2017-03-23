function Robot(team){
	this.team = team;
	var div = $("<div>", {class: team });
	var healthBar = $("<div>",{class: "health"});
	this.view = div;
	healthBar.css({width: 50, height: 7});
 	div.append(healthBar);

 	this.health = 50;
	if(team == 'civ1'){
		div.css({top: 200, left: Util.pick(150, 450)});
	}else{
		div.css({top: 750, left: Util.pick(250, 550)});
	}

	$(document.body).append(div);
	this.counter = 0;
	this.fighting = null;
	
	this.damage = function (deltaHealth) {
		this.health += deltaHealth;
		healthBar.width(this.health);
	};

	this.attack = function (entity) {
		if(this.fighting === null){
			this.fighting = entity;

			// start with the delay so that bouncing about to restart the attack loop 
			// doesn't let the player cheat the 1-second wait
			var robot = this;
			setTimeout(function () {
				attack(robot);
			}, 1000);
		} else {
			// already in an attack() loop, change the target on the fly
			this.fighting = entity;
		}
	};
}
