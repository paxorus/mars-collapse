/**
 * Event handlers for clicking objects and the document.
 *
 * @author Prakhar
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
 * Have a Robot interact with an Entity or select the clicked Entity.
 */
function onEntityClick(event) {
	event.stopPropagation();// click should not propagate to document

	var entity = Entities.get($(event.target));
	var isMyRobot = Entities.myRobot(selectedObject);
	var coordinates = Util.project(event.clientX, event.clientY);

	if (!isMyRobot) {
		selectEntity(entity);
		return;
	}

	// robot is active, direct it to interact with the clicked object if possible
	var robot = selectedObject;

	if (Entities.isEnemy(robot, entity)) {
		declareWar(robot, entity);
	} else if (entity instanceof Building && !entity.isFinished() && !Entities.isEnemy(robot, entity)) {
		robot.build(entity, coordinates);
	} else if (entity instanceof Mine) {
		robot.mine(entity, coordinates);
	} else {
		selectEntity(entity);
	}

}

function selectEntity(entity) {
	if (selectedObject) {
		selectedObject.view.css("opacity", 1);
	}
	entity.view.css("opacity", 0.75);
	entity.display();
	selectedObject = entity;
}


/**
 * If the selected object is an enemy, engage all Robots that are in attack or null mode.
 */
function declareWar(robot, enemyObject) {

	robot.attack(enemyObject);

	// start conflict
	var attackerRobots = Entities.filter(function (entity) {
		return entity instanceof Robot // is a robot
			&& (entity.role === null || entity.role == "Warrior");
	});

	attackerRobots.forEach(function (attacker) {
		if (attacker.team == "civ1") {
			attacker.attack(enemyObject);
		} else {
			attacker.attack(robot);
		}
	});
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
