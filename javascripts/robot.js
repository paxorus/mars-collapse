/**
 * Robot < Entity
 * 
 */

function Robot(team){
	this.type = "Robot";
	this.team = team;
	var div = $("<div>", {class: team });
	this.view = div;
	div.css("left", Util.pick(250, 600));

	$(document.body).append(div);
 	this.addHealthBar(div, 50);

	var robot = this;
	var view = this.view;
	var callback = null;
	var target = null;
	var action = null;
	var speed = 3;

	this.attack = function (entity) {
		target = entity;
		if (action != "attack") {
			action = "attack";
			setTimeout(attack, 1000);
		}
	};

	this.build = function (entity) {
		target = entity;
		if (action != "build") {
			action = "build";
			setTimeout(build, 1000);
		}
		entity.view.click(recruitBuilder);
	};

	this.moveTo = function (newTarget, newCallback){
		target = newTarget;
		callback = newCallback;
		if (action != "move") {
			action = "move";
			movePlayer();
		}
	};

	this.goLeft = function (travelDistanceX){
		this.view.css('left', this.view.position().left +  travelDistanceX );
	};

	this.goUp = function (travelDistanceY){
		this.view.css('top', this.view.position().top + travelDistanceY );
	};

	this.goTo = function (targetX, targetY) {
		this.view.css({left: targetX, top: targetY });
	}


	function attack() {
		if (action != "attack") {	
			return;
		}

		if(Entities.distance(robot, target) > 100){
			// enemy has gone out of range and player not moving
			cancel();
			checkIfAttack(robot);
			return;
		}

		target.applyHealth(-5);

		if(target.health <= 0){
			if (target.view.is(selectedObject)) {
				selectedObject = null;
			}
			target.die();
			// look around for someone else to kill!
			cancel();
			checkIfAttack(robot);
			return;
		}

		setTimeout(attack, 1000);
	}

	function build() {
		if (action != "build") {
			return;
		}

		if (Entities.distance(robot, target) > 100) {
			cancel();
			checkIfAttack(robot);// or maybe look for other things to build?
			return;
		}

		target.build(5);

		if (target.isFinished()) {
			target.finish();

			cancel();
			checkIfAttack(robot);
			return;
		}

		setTimeout(build, 1000);
	}

	function movePlayer() {
		var position = view.position();
		var distanceX = target.x - position.left;
		var distanceY = target.y - position.top;
		var distance = Util.distance(distanceX, distanceY);
		if(distance < speed){
			// final iteration
			robot.goTo(target.x, target.y);
			cancel();
			callback();
		}else{
			robot.goLeft(distanceX * (speed/distance));
			robot.goUp(distanceY * (speed/distance));
			requestAnimationFrame(movePlayer);
		}		
	}

	this.getTarget = function () {
		return target;
	};

	function cancel() {
		action = null;
		target = null;
	}

	// event listeners
	div.click(selectPlayer);
}
