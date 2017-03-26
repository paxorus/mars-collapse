/**
 * Event handlers for clicking objects and the document.
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
		Profile.clear();
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
	entity.display();

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
			&& (entity.action === null || entity.action == "attack");
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