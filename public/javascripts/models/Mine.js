/**
 * @author Jasmine
 */

class Mine extends Entity {
	constructor(num, position) {
		super();
		this.team = "";
		this.type = "Mine";
		// this.addHealthBar(num);
		this.view = env.addMine(position, num);
		// this.healthBar.css("display", "none");
	}

	mining(deltaProgress, soft) {
		if (!soft) {
			resources.metal += deltaProgress;
			resources.update();
			socket.emit('mine', serializeMine(this._id, deltaProgress));
		}

		deltaProgress = Math.min(deltaProgress, this.health);
		super.applyHealth(-deltaProgress, true);
		// this.healthBar.css("display", "block");
	}

	hasMinerals() {
		return this.isAlive;
	}
}