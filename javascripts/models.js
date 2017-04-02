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

	finish() {
		super.finish();
		if (this == selectedObject) {
			Menu.display(this);
		}
	}

 	static get cost() {
 		return [50, 0];
 	}

 	produceRobot() {
 		var robot = new Robot("civ1");
 		Entities.push(robot);
 	}

 }


class Turret extends Building {

	constructor(team, position) {
		super(team, position, 10);
		this.type = "Turret";
		this.view.addClass("turret");
		this.turretCannon = $("<div>", {class: "turret-cannon"});
		this.view.append(this.turretCannon);

	}

	static get cost(){
		return [25,0];
	}

	attack(enemy){
		this._target = enemy.view.position();
		this._missile = $("<div>", {class: "missile"});
		this._missile.css("left", this.view.position().left + 20);
		this._missile.css("top", this.view.position().top + 20);
		$(document.body).append(this._missile);
		setInterval(this._shoot(), 3000);
		//this._target = enemy;
		//this.rotateCannon(enemy.view.position());
	}

	_shoot(){
		var speed = 10;
	
		var position = this._missile.position();
		var distanceX = this._target.left - position.left;
		var distanceY = this._target.top - position.top;
		var distance = Util.distance(distanceX,distanceY);

		if(distance < speed){
			return;
		}

		this._shift(distanceX * (speed/distance), distanceY * (speed/distance));
		requestAnimationFrame(this._shoot.bind(this));
	}


	_shift(missile, deltaX, deltaY){

		this._missile.css({
		   left: this._missile.position().left + deltaX,
		   top: this._missile.position().top + deltaY
		});
	}


	

}
