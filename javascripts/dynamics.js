/**
 * Selecting, moving, and attacking functionality.
 *
 * @author Tristan, Cuimei, Prakhar
 */

var selectedObject = null;// the last clicked player, as a jQuery object

$(document).contextmenu(function (event) {// right-click to deselect
	if(selectedObject){
		selectedObject.css("opacity", 1);
		selectedObject = null;
	}
	event.preventDefault();
});

function selectPlayer(event){
	if(event.target.className != 'civ1' && event.target.className != 'civ2'){
		return;
	}

	if(selectedObject){
		selectedObject.css("opacity", 1);
	}
	selectedObject = $(event.target);// convert to jQuery object
	selectedObject.css("opacity", 0.75);

	event.stopPropagation();// click should not propagate to document
}


/**
 * Move the player to the designated location on the map.
 */
$(document).click(goAndAttack);


function goAndAttack(event) {
	if (!selectedObject) {
		return;
	}
	var robot = Entities.get(selectedObject);
	if (!Entities.is(robot, "Robot")) {
		return;
	}
	var targetX = event.clientX - 20 + document.body.scrollLeft;
	var targetY = event.clientY - 20 + document.body.scrollTop;
	robot.moveTo(targetX, targetY, function () {
		checkIfAttack(robot);
	});
};



/**
 * Update which robots are engaged in combat.
 * Robots will favor attacking the enemy object with the lowest health. Robots will automatically
 * detect a nearby enemy when it enters their radius.
 */
function checkIfAttack(player){

	// identify potential targets: bases, robots, etc.
	var potentialTargets = Entities.filter(function (entity) {
		return Entities.isEnemy(entity, player) // opposite team
			&& Entities.distance(player, entity) <= 100;// within range
	});

	// player attacks enemy of lowest health 
	if(potentialTargets.length > 0){
		var weakestEnemy = potentialTargets.reduce(function(x,y){
			return x.health < y.health ? x : y;
		});

		player.attack(weakestEnemy);
	}

	var enemiesInRange = potentialTargets.filter(function (entity) {
		return entity.type == "Robot" // is a robot
			&& (entity.fighting === null || entity.fighting.health > player.health ); // not attacking its lowest health enemy
	});

	// have each such enemy attack this player
	enemiesInRange.forEach(function (enemy) {
		enemy.attack(player);
	});

}




function attack(player){
	var enemy = player.fighting;

	if (enemy === null) {	
		return;// player is in motion
	}

	if(Entities.distance(player, enemy) > 100){
		// enemy has gone out of range and player not moving
		player.fighting = null;
		checkIfAttack(player);
		return;
	}

	enemy.applyHealth(-5);

	if(enemy.health <= 0){
		if (enemy.view.is(selectedObject)) {
			selectedObject = null;
		}
		enemy.die();
		// look around for someone else to kill!
		player.fighting = null;
		checkIfAttack(player);
		return;
	}

	setTimeout(function () {
		attack(player);
	}, 1000);
}

/**
 * Do building stuff.
 */

document.addEventListener("keydown", function (event) {
	if (event.keyCode == 32) {// on spacebar, until we have a menu
		activateBuildingMode();
		event.preventDefault();// don't scroll down
	}
});

function activateBuildingMode() {
	// menu mousemove: stop propagation, hide factory
	var building = null;

	$(document).off("click");

	$(document).mousemove(function (event) {
		if (building === null) {
			building = new Factory('civ1', {left: event.clientX, top: event.clientY});
		} else {
			building.view.css({left: event.clientX, top: event.clientY});
		}
	});

	// goAndBuild()
	$(document).click(function () {
		// revert mouse behavior
		$(document).off("click");
		$(document).on("click", goAndAttack);
		$(document).off("mousemove");
		Entities.push(building);

		// selected player will move to it
		var robot = Entities.get(selectedObject);
		var targetX = event.clientX - 20 + document.body.scrollLeft;
		var targetY = event.clientY - 20 + document.body.scrollTop;
		robot.moveTo(targetX, targetY, function () {
			setTimeout(function () {
				robot.build(building);
			}, 1000);
		});
	});
}

function build(robot) {
	var building = robot.constructing;

	if (building === null) {
		return;// player is in motion
	}

	if (Entities.distance(robot, building) > 100) {
		robot.constructing = null;
		checkIfAttack(robot);// or maybe look for other things to build?
		return;
	}

	building.build(5);

	if (building.isFinished()) {
		building.finish();

		robot.constructing = null;
		checkIfAttack(robot);
		return;
	}

	setTimeout(function () {
		build(robot);
	}, 1000);
}

function recruitBuilder(event) {
	var robot = Entities.get(selectedObject);
	if (!Entities.is(robot, "Robot")) {
		return;
	}

	var targetX = event.clientX - 20 + document.body.scrollLeft;
	var targetY = event.clientY - 20 + document.body.scrollTop;
	
	var factory = Entities.get($(event.target));

	robot.moveTo(targetX, targetY, function () {
		setTimeout(function () {
			build(robot, factory);
		}, 1000);
	});
	event.stopPropagation();// click should not propagate to document
}