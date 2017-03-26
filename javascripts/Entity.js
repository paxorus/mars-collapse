/**
 * An Entity can take damage, die, and will update its health bar.
 */
class Entity {
	
	constructor(team) {
		this.team = team;
		this.view = $("<div>");
		this.view.click(selectObject);
		$(document.body).append(this.view);
	}

	addHealthBar(health) {
		this.initialHealth = health;
		this.health = health;
		this.healthBar = $("<div>", {class: "health-bar"});
		this.healthBar.css({marginLeft: (this.view.width() - health) / 2 + "px", width: health});
		this.view.append(this.healthBar);
	}

	applyHealth(deltaHealth) {
		this.health += deltaHealth;
		// change size
		this.healthBar.width(this.health);
		// change color
		var color = Util.rybCurve(this.health / this.initialHealth);
		this.healthBar.css("background-color", color);
		Profile.update(this, color);
	}

	die() {
		this.view.remove();
		Entities.remove(this);
		if (this == selectedObject) {
			selectedObject = null;
			Profile.clear();
		}
	}

	display() {
		Profile.display(this);
	}
}

/**
 * Buildings will start at 0% health and finish at 100% health.
 * By default, they have 100 health points.
 */
class Building extends Entity {

	constructor(team, position, initialHealth) {
		super(team);
		this.initialHealth = initialHealth || 100;
		this.view.css(position);
		this.view.css("filter", "brightness(50%)");
		this.view.off("click");
	}

	start() {
		this.addHealthBar(this.initialHealth);
		this.applyHealth(- this.initialHealth);// set health to 0
		this.view.click(recruitBuilder);
		this.view.click(selectObject);
	}

	build(deltaProgress) {
		deltaProgress = Math.min(deltaProgress, this.initialHealth - this.health);
		this.applyHealth(deltaProgress);
	}

	finish() {
		this.view.css("filter", "none");
		this.view.off("click", recruitBuilder);
	}

	isFinished() {
		return this.health >= this.initialHealth;
	}
}



/**
 * CivBase models the team base.
 */
class CivBase extends Entity {
	constructor(team) {
		super(team);
		this.type = "CivBase";

		this.view.addClass("base");

		if (team == "civ1") {
			this.view.addClass("civ1-base");
		} else {
			this.view.addClass("civ2-base");
		}

		this.addHealthBar(200);
	}
}

/**
 * A Factory is a Building with 50 health and CSS class .factory.
 */
class Factory extends Building {

	constructor(team, position) {
		super(team, position, 50);
		this.type = "Factory";
		this.view.addClass("factory");
	}
}
