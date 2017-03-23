function Robot(team){
	this.type = "Robot";
	this.team = team;
	var div = $("<div>", {class: team });
	this.view = div;

	if(team == "civ1"){
		div.css({top: 200, left: Util.pick(100, 500)});
	}else{
		div.css({top: 500, left: Util.pick(100, 500)});
	}

	$(document.body).append(div);
 	this.addHealthBar(div, 50);

	this.counter = 0;
	this.fighting = null;

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

	this.goLeft = function (travelDistanceX){
		this.view.css('left', this.view.position().left +  travelDistanceX );
	};

	this.goUp = function (travelDistanceY){
		this.view.css('top', this.view.position().top + travelDistanceY );
	};

	this.goTo = function (targetX, targetY) {
		this.view.css({left: targetX, top: targetY });
	}

	// event listeners
	div.click(selectPlayer);
}

function CivBase(team) {
	this.type = "CivBase";
	this.team = team;

	var div = $("<div>", {class: "base"});
	this.view = div;

	if (team == "civ1") {
		div.addClass("civ1-base");
	} else {
		div.addClass("civ2-base");
	}

	$(document.body).append(div);
	this.addHealthBar(div, 200);

	div.click(attackBase);
}

var EntityPrototype = {
	addHealthBar: function (view, health) {
		this.initialHealth = health;
		this.health = health;
		this.healthBar = $("<div>", {class: "health-bar"});
		this.healthBar.css({marginLeft: (view.width() - health) / 2 + "px", width: health});
		view.append(this.healthBar);
	},

	applyHealth: function (deltaHealth) {
		this.health += deltaHealth;
		this.healthBar.width(this.health);
		var color = Util.rybCurve(this.health / this.initialHealth);
		this.healthBar.css("background-color", color);
	},

	is: function (type) {
		return type == this.constructor.name;
	},

	die: function () {
		this.view.remove();
		Entities.remove(this);
	}
}

Robot.prototype = EntityPrototype;
CivBase.prototype = EntityPrototype;
