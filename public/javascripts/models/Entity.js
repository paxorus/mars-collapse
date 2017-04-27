/**
 * Implementations of the abstract classes Entity and Attackable.
 *
 * @author Jasmine, Prakhar
 */

/**
 * An Entity has a visual representation that will be removed upon death.
 * It can also be selected.
 */

class Entity {

	constructor() {
		this.type = "Unassigned";
		this.isAlive = true;
		this._id = Util.generateUuid();
		// this.view = $("<div>");
		// this.view.click(onEntityClick);
		// $(document.body).append(this.view);
	}

	isDead() {
		return !this.isAlive;
	}

	die() {
		// die() will only run once
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
		// call this method after adding a class to the view, as this method relies on the final width
		// of the <div> view
		this.initialHealth = health;
		this.health = health;
		this.healthBar = $("<div>", {class: "health-bar"});
		this.healthBar.css({marginLeft: (this.view.width() - health) / 2 + "px", width: health});
		this.view.append(this.healthBar);
	}

	applyHealth(deltaHealth, soft) {
		if (!soft) {
			socket.emit('health', serializeHealth(this._id, deltaHealth));
		}
		
		this.health = Math.max(this.health + deltaHealth, 0);
		if (this.health === 0 && this.isAlive) {
			this.isAlive = false;
			this.die();
		}

		this.updateHealthBar();
	}

	updateHealthBar() {
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
}
