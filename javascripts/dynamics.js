/**
 * Event handlers for
 *
 * @author Tristan, Cuimei, Prakhar
 */

var selectedObject = null;// the last clicked object

/**
 * On right-click, deselect the object.
 */
$(document).contextmenu(function (event) {
	if(selectedObject){
		selectedObject.view.css("opacity", 1);
		selectedObject = null;
	}
	event.preventDefault();
});

/**
 * Clicking a Robot selects it. Clicking a civ2 directs the selected Robot to attack it.
 */
function selectObject(event){
	var entity = Entities.get($(event.target));
	if (entity === null) {
		console.log(event.target);
	}
	if (selectedObject) {
		selectedObject.view.css("opacity", 1);
	}
	entity.view.css("opacity", 0.75);

	if (Entities.myRobot(selectedObject) && Entities.isEnemy(selectedObject, entity)) {
		declareWar(selectedObject, entity);
	}

	selectedObject = entity;
	event.stopPropagation();// click should not propagate to document
}


/**
 * If the selected object is an enemy, engage all Robots that are in attack or null mode.
 */
function declareWar(robot, enemyObject) {

	robot.go(enemyObject, function () {
		robot.attack(enemyObject);
	});

	// start conflict
	var attackerRobots = Entities.filter(function (entity) {
		return entity instanceof Robot // is a robot
			&& (entity.getAction() === null || entity.getAction() == "attack");
	});

	attackerRobots.forEach(function (attacker) {
		if (attacker.team == "civ1") {

			attacker.go(enemyObject, function () {
				attacker.attack(enemyObject);
			});		
		} else {
			attacker.go(robot, function () {
				attacker.attack(robot);
			});
		}
	});

	event.stopPropagation();
}




/**
 * Move the player to the designated location on the map.
 */
function goTo(event) {
	if (!Entities.myRobot(selectedObject)) {
		return;
	}
	var target = Util.project(event.clientX, event.clientY);
	selectedObject.go(target);
};
/**
 * Clicking the document directs the selected Robot to the point.
 */
$(document).click(goTo);



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
		$(document).on("click", goTo);
		$(document).off("mousemove");
		Entities.push(building);
		building.start();

		// selected player will move to it
		if (!Entities.myRobot(selectedObject)) {
			return;
		}
		var robot = selectedObject;
		var target = Util.project(event.clientX, event.clientY);
		robot.go(target, function () {			
			robot.build(building);
		});
	});
}

/**
 * Clicking a building directs the selected Robot to help build it.
 */
function recruitBuilder(event) {
	if (!Entities.myRobot(selectedObject)) {
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