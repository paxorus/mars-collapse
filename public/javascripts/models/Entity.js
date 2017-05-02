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
	}

	isDead() {
		return !this.isAlive;
	}

	die() {
		// die() will only run once
		env.remove(this.view);
		Entities.remove(this);
		if (this == env.selectedObject) {
			env.selectedObject = null;
			Profile.clear();
		}
	}

	display() {
		Profile.display(this);
	}

	markSelected() {
		var material = this.view.material.clone();
		material.transparent = true;
		material.opacity = 0.75;
		this.view.material = material;
	}

	markDeselected() {
		this.view.material.opacity = 1;
	}

	addHealthBar(health) {
		this.initialHealth = health;
		this.health = health;
		this.healthBar = env.addHealthBar(health);
		this.view.add(this.healthBar);
	}

	applyHealth(deltaHealth, soft) {
		if (!soft) {
			socket.emit('health', serializeHealth(this._id, deltaHealth));
		}
		
		this.health = Math.max(this.health + deltaHealth, 0);
		if (this.health === 0 && this.isAlive) {
			this.isAlive = false;
			this.die();
			return;
		}

		this.updateHealthBar();
	}

	updateHealthBar() {
		// change size
		this.healthBar.scale.x = (this.health / this.initialHealth) || 1e-6;
		// change color
		var color = Util.rybCurve(this.health / this.initialHealth);
		this.healthBar.material.color = color;
		Profile.update(this, Util.rgbString(color));
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
