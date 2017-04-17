/**
 * @author Tristan
 */

class Turret extends Building {

	constructor(team, position) {
		super(team, position, 5);
		this.type = "Turret";
		this.view.addClass("turret");
		this.turretCannon = $("<div>", {class: "turret-cannon"});
		var cannonBall = $("<div>", {class: "turret-cannon-ball"});
		this.cannonMuzzle = $("<div>", {class: "turret-cannon-muzzle"});
		this.turretCannon.append(cannonBall);
		this.turretCannon.append(this.cannonMuzzle);
		this.view.append(this.turretCannon);


		this.spinFrame = null;
		this.angle = - Math.PI / 2;
	}

	static get cost(){
		return [25,0];
	}


	createMissile(){
		var missile = $("<div>", {class: "missile"});
		var posX = (this.view.position().left + 24.5)  + ( 15 * Math.cos(this.angle));		
		var posY = (this.view.position().top + 25) + ( 15 * Math.sin(this.angle));
		missile.css("left", posX );
		missile.css("top", posY );
		return missile;
	}

	activateRadar(){
		var turret = this;
		var nearbyEnemies = Entities.filter(function(entity){
			return entity instanceof Robot && Entities.isEnemy(entity, turret) && Entities.distance(entity,turret) < 150;
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
		$(document.body).append(missile);
		this._shoot(missile);

		this.spinFrame = requestAnimationFrame(this._spin.bind(this));
		
	}

	_shoot(missile){
		var speed = 5;
		var target = this._target.view.position();
		var position = missile.position();
		var distanceX = target.left - position.left;
		var distanceY = target.top - position.top;
		var distance = Util.distance(distanceX,distanceY);
		if(distance < speed){
			missile.remove();
			this._target.applyHealth(-5);
			return;
		}

		this._shift(missile, distanceX * (speed/distance), distanceY * (speed/distance));
		requestAnimationFrame(this._shoot.bind(this, missile));
	}


	_spin() {
		if(this._target === null){
			return;
		}
		var position = this.view.position();
		var target = this._target.view.position();
		var distanceX = target.left - position.left;
		var distanceY = target.top - position.top;
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
		var transform = "rotate(" + degrees + "deg)";
		this.turretCannon.css("transform", transform);

		this.spinFrame = requestAnimationFrame(this._spin.bind(this));
	}

	stopTracking() {
		cancelAnimationFrame(this._spinFrame);
	}

	_shift(missile, deltaX, deltaY){

		missile.css({
		   left: missile.position().left + deltaX,
		   top: missile.position().top + deltaY
		});
	}
}