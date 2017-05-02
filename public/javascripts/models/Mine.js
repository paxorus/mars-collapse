/**
 * @author Jasmine
 */

class Mine extends Entity {
	constructor(num, position) {
		super();
		this.team = "";
		this.type = "Mine";
		this.view = env.addMine(position, num);
		this.addHealthBar(num);
		this.healthBar.material.transparent = true;
		this.healthBar.material.opacity = 0;
	}

	mining(deltaProgress, soft) {
		if (!soft) {
			deltaProgress = Math.min(deltaProgress, this.health);
			resources.metal += deltaProgress;
			resources.update();
			socket.emit('mine', serializeMine(this._id, deltaProgress));
		}

		super.applyHealth(-deltaProgress, true);
		this.healthBar.material.opacity = 1;
	}

	hasMinerals() {
		return this.isAlive;
	}

	markSelected() {
		var material = this.view.children[0].material.clone();
		material.transparent = true;
		material.opacity = 0.75;
		this.view.children[0].material = material;
	}

	markDeselected() {
		this.view.children[0].material.opacity = 1;
	}
}