/**
 * Selecting, moving, and attacking functionality.
 *
 * @author Tristan, Cuimei, Prakhar
 */

var playerSelected = null;// the last clicked player, as a jQuery object

$(document).contextmenu(function (event) {// right-click to deselect
	if(playerSelected){
		playerSelected.css("opacity", 1);
		playerSelected = null;
	}
	event.preventDefault();
});

function selectPlayer(event){
	if(event.target.className != 'civ1' && event.target.className != 'civ2'){
		return;
	}

	if(playerSelected){
		playerSelected.css("opacity", 1);
	}
	playerSelected = $(event.target);// convert to jQuery object
	playerSelected.css("opacity", 0.75);

	event.stopPropagation();// click should not propagate to document
}


/**
 * Move the player to the designated location on the map.
 */
$(document).click(function (event){
	if (!playerSelected) {
		return;
	}
	var robot = Entities.get($(playerSelected));
	robot.fighting = null;
	var view = robot.view;
	robot.counter ++;// invalidate all previous movePlayer() animation loops
	var id = robot.counter;
	var speed = 3;
	var targetX = event.clientX - 20 + document.body.scrollLeft;
	var targetY = event.clientY - 20 + document.body.scrollTop;

	function movePlayer() {
		if (robot.counter != id) {// validate this movePlayer() animation loop with the current counter value
			return;
		}
		var position = view.position();
		var distanceX = targetX - position.left;
		var distanceY = targetY - position.top;
		var distance = Util.distance(distanceX, distanceY);
		if(distance < speed){
			// final iteration
			robot.goTo(targetX, targetY);
			checkIfAttack(robot);
		}else{
			robot.goLeft(distanceX * (speed/distance));
			robot.goUp(distanceY * (speed/distance));
			requestAnimationFrame(movePlayer);
		}		
	}
	movePlayer();
});





/**
 * Update which robots are engaged in combat.
 * Robots will favor attacking the enemy object with the lowest health. Robots will automatically
 * detect a nearby enemy when it enters their radius.
 */
function checkIfAttack(player){

	// identify potential targets: bases, robots, etc.
	var potentialTargets = Entities.filter(function (entity) {
		return Entities.isEnemy(entity, player) // opposite team
			&& attackRange(player.view.position(), entity.view.position(), 100);// within range
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
	// console.log(enemiesInRange);

	// have each such enemy attack this player
	enemiesInRange.forEach(function (enemy) {
		enemy.attack(player);
	});

}


/**
 * Calculate whether two objects are close enough.
 * @param player - jQuery Position object
 * @param entity - jQuery Position object
 * @param range - an integer
 * @returns whether the player and entity are in range
 */
function attackRange(player,entity,range){
	return Util.distance(entity.left - player.left, entity.top - player.top) < range;
}

function attack(player){
	var enemy = player.fighting;

	if (enemy === null) {	
		return;// player is in motion
	}

	if(!attackRange(player.view.position(),enemy.view.position(),100)){
		// enemy has gone out of range and player not moving
		player.fighting = null;
		checkIfAttack(player);
		return;
	}

	enemy.applyHealth(-5);

	if(enemy.health <= 0){
		if (playerSelected.is(enemy.view)) {
			playerSelected = null;
		}
		enemy.die();
		// look around for someone else to kill!
		player.fighting = null;
		checkIfAttack(player);
	}

	setTimeout(function () {
		attack(player);
	}, 1000);
}


function attackBase(event) {
	if (playerSelected === null) {
		return;
	}
	var base = Entities.get($(event.target));
	var attacker = Entities.get(playerSelected);

	if (!Entities.isEnemy(attacker, base)) {
		return;
	}

	attacker.fighting = base;
	attack(attacker);
}