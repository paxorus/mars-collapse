/**
 * CivBase models the team base.
 *
 * @author Tristan, Prakhar
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
		// this.view.click(onEntityClick);
		this.view.css("filter", "none");
		this._status = "initial";
	}

	die() {
		super.die();
		var robot = this;
		var otherTeamBases = Entities.filter(function (entity) {
			return entity instanceof CivBase && !Entities.isEnemy(entity, robot);
		});
		if (otherTeamBases.length == 0) {
			endGame(this.team);
		}
	}
}
