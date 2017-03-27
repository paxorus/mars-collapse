/**
 * Implementations of CivBase and Factory.
 *
 * 
 */


/**
 * CivBase models the team base.
 */
class CivBase extends Building {
	constructor(team, position) {
		super(team, position, 200);
		this.type = "CivBase";

		this.view.addClass("base");
		if (team == "civ1") {
			this.view.addClass("civ1-base");
		} else {
			this.view.addClass("civ2-base");
		}
	}

	static get cost() {
		return [100, 0];
	}

	quickstart() {
		// for the initial team bases
		this.addHealthBar(this.initialHealth);
		this.view.click(selectObject);
		this.view.css("filter", "none");
		this._status = "initial";
	}

	onDeath() {
		super.onDeath();
		var robot = this;
		var otherTeamBases = Entities.filter(function (entity) {
			return entity instanceof CivBase && !Entities.isEnemy(entity, robot);
		});
		if (otherTeamBases.length == 0) {
			endGame(this.team);
		}
	}
}

/**
 * A Factory is a Building with 50 health and CSS class .factory.
 */
class Factory extends Building {

	constructor(team, position) {
		super(team, position, 75);
		this.type = "Factory";
		this.view.addClass("factory");
	}

 	static get cost() {
 		return [25, 0];
 	}

 	produceRobot() {
 		var robot = new Robot("civ1");
 		Entities.push(robot);
 	}
}
