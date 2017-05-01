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
		env.selectedObject.view.material.opacity = 1;
		env.selectedObject = null;
		Profile.clear();
	}
	event.preventDefault();
}

/**
 * Have a Robot interact with an Entity or select the clicked Entity.
 */
function onEntityClick(hit) {

	var mesh = hit.object;
	var entity = Entities.get(mesh);
	var isMyRobot = Entities.myRobot(env.selectedObject);
	var coordinates = hit.point;
	// var coordinates = Util.project(event.clientX, event.clientY);

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
		env.selectedObject.view.material.opacity = 1;
	}

	var material = entity.view.material.clone();
	material.transparent = true;
	material.opacity = 0.75;
	entity.view.material = material;
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
