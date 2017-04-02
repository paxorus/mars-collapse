/**
 * Implementations of the abstract classes Entity, Attackable, and Building.
 *
 * @author Prakhar
 */

/**
 * An Entity has a visual representation that will be removed upon death.
 * It can also be selected.
 */

class Entity {

	constructor() {
		this.type = "Unassigned";
		this.isAlive = true;
		this.view = $("<div>");
		this.view.click(selectObject);
		$(document.body).append(this.view);
	}

	die() {
		// die() may be called multiple times
		if (this.isAlive) {
			this.isAlive = false;
			this.onDeath();
		}
	}

	onDeath() {
		// but onDeath() will only run once
		this.isAlive = false;
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
}

/**
 * An Attackable can take damage, die, and will update its health bar.
 */
class Attackable extends Entity {
	
	constructor(team) {
		super();
		this.team = team;
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

	isDead() {
		return this.health <= 0;
	}
}

/**
 * Buildings will start at 0% health and finish at 100% health.
 * By default, they have 100 health points.
 */
class Building extends Attackable {

	constructor(team, position, initialHealth) {
		super(team);
		this.initialHealth = initialHealth || 100;
		this.view.css(position);
		this.view.css("filter", "brightness(50%)");
		this.view.off("click");
		this._status = "incomplete";
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
		this.status = "complete";
	}

	isFinished() {
		return this.health >= this.initialHealth;
	}

	display() {
		super.display();
		$("#other").text(this.status);
	}

	get status() {
		return this._status;
	}

	set status(value) {
		if (this == selectedObject) {
			$("#other").text(value);
		}
		this._status = value;
	}
}
