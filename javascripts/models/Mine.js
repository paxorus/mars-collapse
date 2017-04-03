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

	mining(deltaProgress) {
		deltaProgress = Math.min(deltaProgress, this.health);
		resources.metal += deltaProgress;
		resources.update();

		super.applyHealth(-deltaProgress);
		this.healthBar.css("display", "block");
	}

	hasMinerals() {
		return this.isAlive;
	}
}