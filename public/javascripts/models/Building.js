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
		this.status = "incomplete";
	}

	start() {
		this.addHealthBar(this.initialHealth);
		this.isAlive = false;// don't die in the next step
		this.applyHealth(- this.initialHealth);// set health to 0
		this.isAlive = true;
	}

	build(deltaProgress) {
		deltaProgress = Math.min(deltaProgress, this.initialHealth - this.health);
		this.applyHealth(deltaProgress);
	}

	finish() {
		this.view.css("filter", "none");
		this.status = "complete";
		if (this == selectedObject) {
			$("#other").text("complete");
		}
	}

	isFinished() {
		return this.health >= this.initialHealth;
	}

	display() {
		super.display();
		$("#other").text(this.status);
	}
}
