/**
 * Selecting, moving, and attacking functionality.
 *
 * @author Tristan, Cuimei, Prakhar
 */

var selectedObject = null;// the last clicked object

// 
$(document).contextmenu(function (event) {// right-click to deselect
	if(selectedObject){
		selectedObject.view.css("opacity", 1);
		selectedObject = null;
	}
	event.preventDefault();
});

function selectPlayer(event){
	var entity = Entities.get($(event.target));
	if (!(entity instanceof Robot)) {
		return;
	}

	if(selectedObject){
		selectedObject.view.css("opacity", 1);
	}
	entity.view.css("opacity", 0.75);
	selectedObject = entity;

	event.stopPropagation();// click should not propagate to document
}


/**
 * Move the player to the designated location on the map.
 */
$(document).click(goAndAttack);

function attackObject(event) {
	if (!Entities.is(selectedObject, "Robot")) {
		return;
	}
	var enemyObject = Entities.get($(event.target));
	var robot = selectedObject;

	robot.go(enemyObject.view.position(), function () {
		robot.attack(enemyObject);
	});
	event.stopPropagation();
}


function goAndAttack(event) {
	if (!Entities.is(selectedObject, "Robot")) {
		return;
	}
	var target = Util.project(event.clientX, event.clientY);
	var robot = selectedObject;

	robot.go(target);
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
		var weakestEnemy = potentialTargets.reduce(function(x, y) {
			return (x.health < y.health) ? x : y;
		});

		player.attack(weakestEnemy);
	}

	var enemiesInRange = potentialTargets.filter(function (entity) {
		return entity instanceof Robot // is a robot
			&& (entity.getTarget() === null || entity.getTarget().health > player.health ); // not attacking its lowest health enemy
	});

	// have each such enemy attack this player
	enemiesInRange.forEach(function (enemy) {
		enemy.attack(player);
	});

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
		var position = {
			left: event.clientX + document.body.scrollLeft,
			top: event.clientY + document.body.scrollTop
		 };
		if (building === null) {
			building = new Factory('civ1', position);
		} else {
			building.view.css(position);
		}
	});


	// goAndBuild()
	$(document).click(function () {
		// revert mouse behavior
		$(document).off("click");
		$(document).on("click", goAndAttack);
		$(document).off("mousemove");
		Entities.push(building);
		building.start();

		// selected player will move to it
		if (!Entities.is(selectedObject, "Robot")) {
			return;
		}
		var robot = selectedObject;
		var target = Util.project(event.clientX, event.clientY);
		robot.go(target, function () {			
			robot.build(building);
		});
	});
}



function recruitBuilder(event) {
	if (!Entities.is(selectedObject, "Robot")) {
		return;
	}

	var target = Util.project(event.clientX, event.clientY);	
	var robot = selectedObject;
	var building = Entities.get($(event.target));

	robot.go(target, function () {
		robot.build(building);
	});
	event.stopPropagation();// click should not propagate to document
}