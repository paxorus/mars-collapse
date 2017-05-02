/**
 * Event handlers for clicking objects and the document.
 *
 * @author Prakhar
 */


/**
 * On right-click, deselect the object.
 */
function deselectObject(event) {
	if (env.selectedObject) {
		env.selectedObject.markDeselected();
		env.selectedObject = null;
		Profile.clear();
	}
	event.preventDefault();
}

function handleClick(event) {
	event.stopPropagation();
	var hit = env.unproject(event.clientX, event.clientY);
	var mesh = hit.object;

	while (!(mesh.parent instanceof THREE.Scene)) {
		mesh = mesh.parent;
	}
	
	if (env.isFloor(mesh)) {
		goTo(hit);
	} else {
		onEntityClick(hit.point, mesh);
	}
}

/**
 * Have a Robot interact with an Entity or select the clicked Entity.
 */
function onEntityClick(coordinates, mesh) {

	var entity = Entities.get(mesh);
	var isMyRobot = Entities.myRobot(env.selectedObject);

	if (!isMyRobot) {
		selectEntity(entity);
		return;
	}

	// robot is active, direct it to interact with the clicked object if possible
	var robot = env.selectedObject;

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
	if (env.selectedObject) {
		env.selectedObject.markDeselected();
	}

	entity.markSelected();
	entity.display();
	env.selectedObject = entity;
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
		if (attacker.team == My.TEAM) {
			attacker.attack(enemyObject);
		} else {
			attacker.attack(robot);
		}
	});
}


/**
 * Move the player to the designated location on the map.
 */
function goTo(hit) {
	if (Entities.myRobot(env.selectedObject)) {
		env.selectedObject.go(hit.point);
	}	
};
