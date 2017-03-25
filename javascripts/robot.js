/**
 * Robot < Entity
 * 
 */

function Robot(team){
	this.type = "Robot";
	this.team = team;
	var div = $("<div>", {class: team });
	this.view = div;

	if(team == "civ1"){
		div.css({top: 200, left: Util.pick(250, 600)});
	}else{
		div.css({top: 500, left: Util.pick(250, 600)});
	}

	$(document.body).append(div);
 	this.addHealthBar(div, 50);

	this.counter = 0;
	this.fighting = null;
	this.constructing = null;

	this.attack = function (entity) {
		if (this.fighting === null) {
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

	this.build = function (entity) {
		entity.view.click(recruitBuilder);

		if (this.constructing === null) {
			this.constructing = entity;
			var robot = this;
			setTimeout(function () {
				build(robot);
			}, 1000);
		} else {
			this.constructing = entity;
		}
	}

	this.moveTo = function (targetX, targetY, callback){
		var robot = this;
		this.fighting = null;
		this.constructing = null;
		var view = this.view;
		this.counter ++;// invalidate all previous movePlayer() animation loops
		var id = this.counter;
		var speed = 3;

		function movePlayer() {
			if (robot.counter != id) {// validate this movePlayer() animation loop with the current counter value
				return;
			}
			var position = view.position();
			var distanceX = targetX - position.left;
			var distanceY = targetY - position.top;
			var distance = Util.distance(distanceX, distanceY);
			if(distance < speed){
				// final iteration
				robot.goTo(targetX, targetY);
				callback();
			}else{
				robot.goLeft(distanceX * (speed/distance));
				robot.goUp(distanceY * (speed/distance));
				requestAnimationFrame(movePlayer);
			}		
		}
		movePlayer();
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

/**
 * CivBase < Entity
 * 
 */

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

	// event listeners
	// div.click(attackBase);
}

function Factory(team, position) {
	this.type = "Factory";
	this.team = team;
	this.initialHealth = 300;

	this.init("factory", position);

}



/*
 * An Entity can take damage, die, and will update its health bar.
 */
var Entity = {
	addHealthBar: function (view, health) {
		this.initialHealth = health;
		this.health = health;
		this.healthBar = $("<div>", {class: "health-bar"});
		this.healthBar.css({marginLeft: (view.width() - health) / 2 + "px", width: health});
		view.append(this.healthBar);
	},

	applyHealth: function (deltaHealth) {
		this.health += deltaHealth;
		// change size
		this.healthBar.width(this.health);
		// change color
		var color = Util.rybCurve(this.health / this.initialHealth);
		this.healthBar.css("background-color", color);
	},

	die: function () {
		this.view.remove();
		Entities.remove(this);
	}
}

function BuildingPrototype() {

	this.initialHealth = 100;

	this.build = function (deltaProgress) {
		deltaProgress = Math.min(deltaProgress, this.initialHealth - this.health);
		this.applyHealth(deltaProgress);
	};

	this.finish = function () {
		this.view.css("filter", "none");
	};

	this.isFinished = function () {
		return this.health >= this.initialHealth;
	};

	this.init = function (type, position) {
		var div = $("<div>", {class: type});
		div.css(position);
		div.css("filter", "brightness(50%)");
		this.view = div;
		// this.view.click(recruitBuilder);
		$(document.body).append(div);

		this.addHealthBar(div, this.initialHealth);
		this.applyHealth(- this.initialHealth);
	}

}

Robot.prototype = Entity;
BuildingPrototype.prototype = Entity;
CivBase.prototype = Entity;

var Building = new BuildingPrototype();
Factory.prototype = Building;