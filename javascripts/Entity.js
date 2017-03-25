
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
}

function Factory(team, position) {
	this.type = "Factory";
	this.team = team;
	this.initialHealth = 150;

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