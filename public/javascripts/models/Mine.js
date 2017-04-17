/**
 * @author Jasmine
 */

class Mine extends Entity {
	constructor(num) {
		super();
		this.team = "";
		this.type = "Mine";
		this.view.addClass("mine");
		this.addHealthBar(num);
		this.view.css("top", Util.pick(70, window.innerHeight - 95));
		this.view.css("left", Util.pick(70, window.innerWidth - 95));
		this.healthBar.css("display", "none");
	}

	mining(deltaProgress, soft) {
		deltaProgress = Math.min(deltaProgress, this.health);
		super.applyHealth(-deltaProgress);
		this.healthBar.css("display", "block");

		if (!soft) {
			resources.metal += deltaProgress;
			resources.update();
			socket.emit('mine', serializeMine(this._id, deltaProgress));
		}
	}

	hasMinerals() {
		return this.isAlive;
	}
}