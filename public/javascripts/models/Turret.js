/**
 * @author Tristan
 */

class Turret extends Building {

	constructor(team, position) {
		super(team, position, 5);
		this.type = "Turret";
		// this.view.addClass("turret");
		// this.turretCannon = $("<div>", {class: "turret-cannon"});
		// var cannonBall = $("<div>", {class: "turret-cannon-ball"});
		// this.cannonMuzzle = $("<div>", {class: "turret-cannon-muzzle"});
		// this.turretCannon.append(cannonBall);
		// this.turretCannon.append(this.cannonMuzzle);
		// this.view.append(this.turretCannon);
		var color;
		if(team == 'civ1'){
			color = 0x00ff00;
		}else{
			color = 0x0000ff;
		}
		this.view = env.addTurret(position,color);
		this.cannon = env.addTurretCannon();
		env.appendObjects(this.view, this.cannon);
		this.spinFrame = null;
		this.angle = - Math.PI / 2;
	}

	static get cost(){
		return [25,0];
	}


	createMissile(){
		
		var missile = env.addMissile([this.view.position['x'], this.view.position['z']]);
		// var missile = $("<div>", {class: "missile"});
		// var posX = (this.view.position().left + 24.5)  + ( 15 * Math.cos(this.angle));		
		// var posY = (this.view.position().top + 25) + ( 15 * Math.sin(this.angle));
		// missile.css("left", posX );
		// missile.css("top", posY );

		return missile;
	}

	activateRadar(){
		var turret = this;
		var nearbyEnemies = Entities.filter(function(entity){
			return entity instanceof Robot && Entities.isEnemy(entity, turret) && Entities.distance(entity,turret) < 200;
		});

		this.stopTracking();
		// TODO: choose weakest enemy
		if(nearbyEnemies.length > 0){
			turret.attack(nearbyEnemies[0]);
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
		var missile = this.createMissile();
		this._shoot(missile);

	 this.spinFrame = requestAnimationFrame(this._spin.bind(this));
		
	}

	_shoot(missile){
		var speed = 4;
		var target = this._target.view.position;
		var position = missile.position;
		var distanceX = target.x - position.x;
		var distanceY = target.z - position.z;
		var distance = Util.distance(distanceX,distanceY);
		if(distance < speed){
			env.removeObject(missile);
			//this._target.applyHealth(-5);
			return;
		}

		this._shift(missile, distanceX * (speed/distance), distanceY * (speed/distance));
		requestAnimationFrame(this._shoot.bind(this, missile));
	}


	_spin() {
		if(this._target === null){
			return;
		}
		var position = this.view.position;
		var target = this._target.view.position;
		var distanceX = target.x - position.x;
		var distanceY = target.z - position.z;
		var desiredAngle = Math.atan2(distanceY, distanceX);
		var deltaAngle = this.angle - desiredAngle;
		if (deltaAngle < 0) {
			deltaAngle += 2 * Math.PI;
		}
		if (deltaAngle >= Math.PI) {
			this.angle += 0.03;
			if (this.angle > Math.PI) {
				this.angle -= 2 * Math.PI;
			}
		} else {
			this.angle -= 0.03;
			if (this.angle < -Math.PI) {
				this.angle += 2 * Math.PI;
			}
		}
		var degrees = this.angle * 180 / Math.PI + 90;
		this.cannon.rotation.y = degrees;
		// var transform = "rotate(" + degrees + "deg)";
		// this.turretCannon.css("transform", transform);

		this.spinFrame = requestAnimationFrame(this._spin.bind(this));
	}

	stopTracking() {
		cancelAnimationFrame(this._spinFrame);
	}

	_shift(missile, deltaX, deltaZ){
		missile.position.x += deltaX
		missile.position.z += deltaZ
		  
	}
}