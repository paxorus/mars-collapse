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
 	}

	attack(entity) {
		this._target = entity;
		if (this.action != "attack") {
			this.action = "attack";
			setTimeout(this._attack.bind(this), 1000);
		}
	}

	build(entity) {
		this._target = entity;
		if (this.action != "build") {
			this.action = "build";
			setTimeout(this._build.bind(this), 1000);
		}
		entity.view.click(recruitBuilder);
	}

	go(newTarget, newCallback) {
		this._target = newTarget;
		this._callback = newCallback || null;
		if (this.action != "go") {
			this.action = "go";
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
		if (this.action != "attack") {	
			return;
		}

		if (Entities.distance(this, this._target) > 100){
			// enemy has gone out of range and player not moving
			this.cancel();
			this._continueAttacking();
			return;
		}

		this._target.applyHealth(-5);

		if(this._target.health <= 0){
			this._target.die();
			// look around for someone else to kill!
			this.cancel();
			this._continueAttacking();
			return;
		}

		setTimeout(this._attack.bind(this), 1000);
	}

	_build() {
		if (this.action != "build") {
			return;
		}

		// buildings can't move

		this._target.build(5);

		if (this._target.isFinished()) {
			this._target.finish();
			this.cancel();
			this._continueBuilding();
			return;
		}

		setTimeout(this._build.bind(this), 1000);
	}

	_go() {
		var target = ("view" in this._target) ? this._target.view.position() : this._target;
		var position = this.view.position();
		var distanceX = target.left - position.left;
		var distanceY = target.top - position.top;
		var distance = Util.distance(distanceX, distanceY);
		if(distance < this._speed){
			// final iteration
			this.goTo(target.left, target.top);
			this.cancel();
			if (this._callback !== null) {
				this._callback();
			}
		}else{
			this.shift(distanceX * (this._speed/distance), distanceY * (this._speed/distance));
			requestAnimationFrame(this._go.bind(this));
		}
	}

	_continueAttacking() {
		var robot = this;
		// identify potential targets: bases, robots, etc.
		var potentialTargets = Entities.filter(function (entity) {
			return Entities.isEnemy(robot, entity) // opposite team
		});

		if(potentialTargets.length == 0){
			// do nothing
			return;
		}

		var enemy;
		if (potentialTargets.length == 1) {
			enemy = potentialTargets[0];
		} else {
			var enemyCostTuples = potentialTargets.map(function (e) {
				var cost = Entities.distance(robot, e) + 36 * e.health;// distance + remaining health
				return [cost, e];
			});
			var bestEnemyCost = enemyCostTuples.reduce(function(x, y) {
				return (x[0] < y[0]) ? x : y;
			});
			enemy = bestEnemyCost[1];
		}

		robot.go(enemy, function () {
			robot.attack(enemy);
		});
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
			var buildingCostTuples = potentialTargets.map(function (b) {
				var cost = Entities.distance(robot, b) + 36 * (b.initialHealth - b.health);// distance + remaining progress
				return [cost, b];
			});

			var bestBuildingCost = buildingCostTuples.reduce(function (x, y) {
				return (x[0] < y[0]) ? x : y;
			});
			building = bestBuildingCost[1];
		}

		robot.go(building, function () {
			robot.build(building);
		});
	}

	cancel() {
		this.action = null;
		this._target = null;
	}

	display() {
		super.display();
		var action = (this.action === null) ? "idle" : this.action;
		$("#other").text(action + " mode");
	}

	set action(value) {
		if (this == selectedObject) {
			value = (value === null) ? "idle" : value;
			$("#other").text(value + " mode");
		}
		this._action = value;
	}

	get action() {
		return this._action;
	}
}
