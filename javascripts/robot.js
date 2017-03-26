/**
 * Robot < Entity
 * 
 */

class Robot extends Entity {
	constructor(team) {
		super(team);
		this.type = "Robot";
		this._callback = null;
		this._target = null;
		this._action = null;
		this._speed = 3;

		this.view.addClass("robot");
		if (team == "civ1") {
			this.view.addClass("civ1-robot");
		} else {
			this.view.addClass("civ2-robot");
		}
		this.view.css("left", Util.pick(250, 600));
	 	this.addHealthBar(50);

 		// event listeners
		// if (team == "civ1") {
			this.view.click(selectPlayer);
		// }
 	}

	attack(entity) {
		this._target = entity;
		if (this._action != "attack") {
			this._action = "attack";
			setTimeout(this._attack.bind(this), 1000);
		}
	}

	build(entity) {
		this._target = entity;
		if (this._action != "build") {
			this._action = "build";
			setTimeout(this._build.bind(this), 1000);
		}
		entity.view.click(recruitBuilder);
	}

	go(newTarget, newCallback) {
		this._target = newTarget;
		this._callback = newCallback || null;
		if (this._action != "go") {
			this._action = "go";
			this._go();
		}
	}

	shift(deltaX, deltaY) {
		this.view.css({
			left: this.view.position().left +  deltaX,
			top: this.view.position().top + deltaY
		});
	}

	goTo(targetX, targetY) {
		this.view.css({left: targetX, top: targetY });
	}


	_attack() {
		if (this._action != "attack") {	
			return;
		}

		if (Entities.distance(this, this._target) > 100){
			// enemy has gone out of range and player not moving
			this.cancel();
			checkIfAttack(robot);
			return;
		}

		this._target.applyHealth(-5);

		if(this._target.health <= 0){
			if (this._target.view.is(selectedObject)) {
				selectedObject = null;
			}
			this._target.die();
			// look around for someone else to kill!
			this.cancel();
			checkIfAttack(this);
			return;
		}

		setTimeout(this._attack.bind(this), 1000);
	}

	_build() {
		if (this._action != "build") {
			return;
		}

		if (Entities.distance(this, this._target) > 100) {
			this.cancel();
			checkIfAttack(robot);// or maybe look for other things to build?
			return;
		}

		this._target.build(5);

		if (this._target.isFinished()) {
			this._target.finish();
			this.cancel();
			this._continueBuilding();
			checkIfAttack(robot);
			return;
		}

		setTimeout(this._build.bind(this), 1000);
	}

	_go() {
		var position = this.view.position();
		var distanceX = this._target.left - position.left;
		var distanceY = this._target.top - position.top;
		var distance = Util.distance(distanceX, distanceY);
		if(distance < this._speed){
			// final iteration
			this.goTo(this._target.left, this._target.top);
			this.cancel();
			if (this._callback !== null) {
				this._callback();
			}
		}else{
			this.shift(distanceX * (this._speed/distance), distanceY * (this._speed/distance));
			requestAnimationFrame(this._go.bind(this));
		}
	}

	_continueBuilding() {
		var robot = this;
		var potentialTargets = Entities.filter(function (entity) {
			return entity instanceof Building
				&& !Entities.isEnemy(entity, robot) // same team
				&& !entity.isFinished();
		});

		if (potentialTargets.length == 0) {
			// do nothing
			return;
		}

		var building;
		if (potentialTargets.length == 1) {
			building = potentialTargets[0];
		} else {
			var bestBuildingCost = potentialTargets.reduce(function (x, y) {
				var yCost = Entities.distance(robot, y) + (y.initialHealth - y.health);// distance + remaining progress
				console.log(Entities.distance(robot, y), y.initialHealth - y.health);
				return (x[0] < yCost) ? x : [yCost, y];
			});
			building = bestBuildingCost[1];
		}

		robot.go(building.view.position(), function () {
			robot.build(building);
		});
	}

	getTarget() {
		return this._target;
	}

	cancel() {
		this._action = null;
		this._target = null;
	}
}
