/**
 * @author Tristan
 */

class Turret extends Building {

	constructor(team, position) {
		super(team, position, 5);
		this.type = "Turret";
		this.view = env.addTurret(position);
		this.cannon = env.addTurretCannon();
		this.view.add(this.cannon);
		this.shadow();

		this.spinFrame = null;
		this.angle = 0;
		this.lastFire = 0;

		this.SPIN_SPEED = 0.03;
		this.RELOAD_TIME = 250;
		this.MISSILE_SPEED = 0.5;
	}

	static get cost(){
		return [25,0];
	}

	activateRadar(){
		var turret = this;
		var nearbyEnemies = Entities.filter(function(entity){
			return entity instanceof Robot && Entities.isEnemy(entity, turret) && Entities.distance(entity,turret) < 200;
		});

		this.stopTracking();
		// TODO: choose weakest enemy
		if(nearbyEnemies.length > 0){
			this.attack(nearbyEnemies[0]);
		}else{
			this._target = null;
		}

		setTimeout(this.activateRadar.bind(this), 1000);
	}

	finish() {
		super.finish();
		this.activateRadar();
	}

	attack(enemy){
		this._target = enemy;
		this.spinFrame = requestAnimationFrame(this._spin.bind(this));
	}

	shoot() {
		// fire at most twice/second
		if (new Date() - this.lastFire > this.RELOAD_TIME) {
			var missile = env.addMissile(this.view.position);
			this._shoot(missile);
			this.lastFire = new Date();
		}
	}

	_shoot(missile){
		if (this._target === null) {// fly straight
			this._shift(missile, missile.velocity[0], missile.velocity[1]);
			if (env.inBounds(missile)) {
				this.shootFrame = requestAnimationFrame(this._shoot.bind(this, missile));
			} else {
				env.remove(missile);
			}
			return;
		}

		// home in on the target
		var target = this._target.view.position;
		var position = missile.position;
		var distanceX = target.x - position.x;
		var distanceY = target.z - position.z;
		var distance = Util.distance(distanceX,distanceY);
		if(distance < this.MISSILE_SPEED){
			env.remove(missile);
			this._target.applyHealth(-5);
			return;
		}

		this._shift(missile, distanceX * (this.MISSILE_SPEED/distance), distanceY * (this.MISSILE_SPEED/distance));
		this.shootFrame = requestAnimationFrame(this._shoot.bind(this, missile));
	}


	_spin() {
		if(this._target === null){
			return;
		}
		var position = this.view.position;
		var target = this._target.view.position;
		var distanceX = target.x - position.x;
		var distanceZ = -(target.z - position.z);
		var desiredAngle = Math.atan2(distanceZ, distanceX);// [-pi, pi]
		var deltaAngle = desiredAngle - this.angle;// [-2pi, 2pi]
		if (Math.abs(deltaAngle) <= this.SPIN_SPEED) {
			this.angle = desiredAngle;
			this.shoot();
		}
		if (deltaAngle < 0) {// [0, 2pi]
			deltaAngle += 2 * Math.PI;
		}
		if (deltaAngle <= Math.PI) {
			this.angle += this.SPIN_SPEED;
			if (this.angle > Math.PI) {
				this.angle -= 2 * Math.PI;
			}
		} else {
			this.angle -= this.SPIN_SPEED;
			if (this.angle < -Math.PI) {
				this.angle += 2 * Math.PI;
			}
		}
		this.cannon.rotation.y = this.angle;

		this.spinFrame = requestAnimationFrame(this._spin.bind(this));
	}

	stopTracking() {
		cancelAnimationFrame(this.spinFrame);
	}

	_shift(missile, deltaX, deltaZ){
		missile.position.x += deltaX;
		missile.position.z += deltaZ;
		missile.velocity = [deltaX, deltaZ];// save as inherent property
	}
}