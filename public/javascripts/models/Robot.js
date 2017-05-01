/**
 * Robots can be in idle, attack, build, or go mode.
 * 
 * @author Jasmine, Prakhar
 */

class Robot extends Attackable {
	constructor(team, position) {
		super(team);
		this.type = "Robot";
		this.role = null;
		this._SPEED = 2;
		this._FUZZY = 10;
		this._target = null;
		this._timeout = null;
		this._animation = null;

	 	// this.addHealthBar(50);
	 	this.view = env.addRobot(position, team);
	 	
	 	if (team == My.TEAM) {
		 	resources.robot ++;
		 	resources.update();
	 	}
 	}

 	static get cost() {
 		return [10, 0];
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
			this.cancel();
			this._continueBuilding();
			return;
		}

		this._timeout = setTimeout(this._build.bind(this), 1000);
	}

	_go(callback) {
		// _target may be an Entity or XYZ object
		var target = Entities.isEntity(this._target) ? this._target.view.position : this._target;
		var position = this.view.position;
		var distanceX = target.x - position.x;
	    var distanceZ = target.z - position.z;
		var distance = Util.distance(distanceX, distanceZ);

	 	if(distance < this._FUZZY){
	 		// close enough, stop
	 		this.cancel();
	 		if (callback !== null) {
	 			callback();
	 		}
	 		return;
  		}
  		// console.log
	 	this.shift(distanceX * (this._SPEED/distance), distanceZ * (this._SPEED/distance));
		this._animation = requestAnimationFrame(this._go.bind(this, callback));
	}

	_mine() {
		this._target.mining(5);
		if (!this._target.hasMinerals()) {
			this.cancel();
			this._continueMining();
			return;
		}
		this._timeout = setTimeout(this._mine.bind(this), 1000);
	}
	
	shift(deltaX, deltaZ, soft) {
		if (!soft) {
			socket.emit('location', serializeLocation(this._id, deltaX, deltaZ));
		}

		this.view.position.x += deltaX;
		// console.log(deltaZ);
		this.view.position.z += deltaZ;
	}

	_continueAttacking() {
		var enemy = RobotAI.getClosestWeakestEnemy(this);
		if (enemy !== null) {
			this.attack(enemy);
		} else {
			this.finish();
		}
	}

	_continueBuilding() {
		var building = RobotAI.getClosestMostCompleteBuilding(this);
		if (building !== null) {
			this.build(building);
		} else {
			this.finish();
		}
	}

	_continueMining() {
		var mine = RobotAI.getClosestMostPlentifulMine(this);
		if (mine !== null) {
			this.mine(mine);
		} else {
			this.finish();
		}
	}

	finish() {
		this.role = null;
	}

	cancel() {
		clearTimeout(this._timeout);
		cancelAnimationFrame(this._animation);
	}

	changeRole(role) {
		this.role = role;
		if (env.selectedObject == this) {
			this.display();
		}
	}

	display() {
		super.display();
		if (env.selectedObject == this && this.role !== null) {
			$("#other").text(this.role);
		}
	}

	die() {
		super.die();
		if (this.team == My.TEAM) {
			resources.pay([0, 1]);
		}
	}
}
