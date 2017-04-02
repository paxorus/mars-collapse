/**
 * Robots can be in idle, attack, build, or go mode.
 * 
 * @author Jasmine, Prakhar
 */

class Robot extends Attackable {
	constructor(team) {
		super(team);
		this.type = "Robot";
		this.role = null;
		this._SPEED = 3;
		this._FUZZY = 45;
		this._target = null;
		this._action = null;
		this._timeout = null;
		this._animation = null;

		this.view.addClass("robot");
		if (team == "civ1") {
			this.view.addClass("civ1-robot");
		} else {
			this.view.addClass("civ2-robot");
		}
		this.view.css("left", Util.pick(250, 600));
	 	this.addHealthBar(50);
 	}

 	static get cost() {
 		return [10, -1];
 	}

	attack(entity, coordinates) {
		var robot = this;
		this.changeRole("Warrior");
		this.go(coordinates || entity, function () {
			robot._target = entity;
			robot._timeout = setTimeout(robot._attack.bind(robot), 1000);
		});
	}

	build(entity, coordinates) {
		var robot = this;
		this.changeRole("Builder");
		this.go(coordinates || entity, function () {
			robot._target = entity;
			robot._timeout = setTimeout(robot._build.bind(robot), 1000);
		});
	}

	go(target, callback) {
		this._target = target;
		this.cancel();
		this._animation = requestAnimationFrame(this._go.bind(this, callback || null));
	}

	mine(entity, coordinates) {
		var robot = this;
		this.changeRole("Miner");
		this.go(coordinates || entity, function () {
			robot._target = entity;
			robot._timeout = setTimeout(robot._mine.bind(robot), 1000);
		});
	}

	// Private methods for the action loop.

	_attack() {
		if (Entities.distance(this, this._target) > 100){
			// enemy has gone out of range
			this.cancel();
			this._continueAttacking();
			return;
		}

		this._target.applyHealth(-5);

		if(this._target.isDead()){
			this._target.die();
			// look around for someone else to kill!
			this.cancel();
			this._continueAttacking();
			return;
		}

		this._timeout = setTimeout(this._attack.bind(this), 1000);
	}

	_build() {
		// buildings can't move, so we don't check distance

		this._target.build(5);

		if (this._target.isFinished()) {
			this._target.finish();
			this.cancel();
			this._continueBuilding();
			return;
		}

		this._timeout = setTimeout(this._build.bind(this), 1000);
	}

	_go(callback) {
		// _target may be an Entity or jQuery Position object
		var target = ("view" in this._target) ? this._target.view.position() : this._target;
		var position = this.view.position();
		var distanceX = target.left - position.left;
		var distanceY = target.top - position.top;
		var distance = Util.distance(distanceX, distanceY);

		if(distance < this._FUZZY){
			// close enough, stop
			this.cancel();
			if (callback !== null) {
				callback();
			}
			return;
		}

		this.shift(distanceX * (this._SPEED/distance), distanceY * (this._SPEED/distance));
		this._animation = requestAnimationFrame(this._go.bind(this, callback));
	}

	_mine() {
		this._target.mining(5);
		if (this._target.hasMinerals() <= 0) {
			this._target.die();
			this.cancel();
			this._continueMining();
			return;
		}
		this._timeout = setTimeout(this._mine.bind(this), 1000);
	}
	
	shift(deltaX, deltaY) {
		this.view.css({
			left: this.view.position().left +  deltaX,
			top: this.view.position().top + deltaY
		});
	}


	// Methods for computing a new target.

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

		// var building;
		if (potentialTargets.length == 1) {
			var building = potentialTargets[0];
		} else {
			var buildingCostTuples = potentialTargets.map(function (b) {
				var cost = Entities.distance(robot, b) + 36 * (b.initialHealth - b.health);// distance + remaining progress
				return [cost, b];
			});

			var bestBuildingCost = buildingCostTuples.reduce(function (x, y) {
				return (x[0] < y[0]) ? x : y;
			});
			var building = bestBuildingCost[1];
		}

		robot.build(building);
	}

	_continueMining() {
		var robot = this;
		var potentialTargets = Entities.filter(function (entity) {
			return entity instanceof Mine;
		});

		if (potentialTargets.length == 0) {
			// do nothing
			return;
		}

		if (potentialTargets.length == 1) {
			var mine = potentialTargets[0];
		} else {
			var mineCostTuples = potentialTargets.map(function (m) {
				var cost = Entities.distance(robot, m) / m.amount;
				return [cost, m];
			});
			var bestMineCost = mineCostTuples.reduce(function(x, y) {
				return (x[0] < y[0]) ? x : y;
			});
			var mine = bestMineCost[1];
		}

		robot.mine(mine);
	}
	/**
	 * Causes the action loop to silently exit and triggers the Profile to update.
	 */
	cancel() {
		clearTimeout(this._timeout);
		cancelAnimationFrame(this._animation);
	}

	changeRole(role) {
		this.role = role;
		this.display();
	}

	display() {
		super.display();
		if (this.role !== null) {
			$("#other").text(this.role);
		}
	}

	onDeath() {
		super.onDeath();
		if (this.team == "civ1") {
			resources.pay([0, 1]);
		}
	}
}
