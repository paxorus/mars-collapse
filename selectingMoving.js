/**
 * @author Tristan, Cuimei, Prakhar
 */

var playerSelected = null;// the last clicked player, as a jQuery object


function selectPlayer(event){
	if(event.target.className != 'civ1' && event.target.className != 'civ2'){
		return;
	}

	if(playerSelected){
		playerSelected.css("opacity", 1);
	}
	playerSelected = $(event.target);// enhances the event.target (not a regular html object)
	playerSelected.css("opacity", 0.75);

	event.stopPropagation();// Click should not propagate to document

}


//This method is used to move the player 
//we use a counter variable for the movePlayer method, in order so that when a
//user clicks at a point on the screen while the player is moving, the movePlayer function for the first move stops
//(as counter will not be equal to id anymore, thus returning) and the second moving process starts
$(document).click(function (event){
	if (!playerSelected) {
		return;
	}
	var entity = Entities.get($(playerSelected));
	entity.fighting = null;
	var view = entity.view;
	entity.counter ++;// invalidate all previous animation loops
	var id = entity.counter;
	var speed = 3;
	var targetX = event.clientX - 20 + document.body.scrollLeft;
	var targetY = event.clientY - 20 + document.body.scrollTop;

	function movePlayer() {
		if (entity.counter != id) {// validate this animation loop with the current counter value
			return;
		}
		var position = view.position();
		var distanceX = targetX - position.left;
		var distanceY = targetY - position.top;
		var distance = Util.distance(distanceX, distanceY);
		if(distance < speed){
			// final iteration
			view.css({left: targetX, top: targetY });
			checkIfAttack(entity);
		}else{
			goLeft(view,distanceX * (speed/distance));
			goUp(view,distanceY * (speed/distance));
			requestAnimationFrame(movePlayer);
		}
			
	}
	movePlayer();
});


function goLeft(player,travelDistanceX){
	player.css('left', player.position().left +  travelDistanceX );
}


function goUp(player,travelDistanceY){
	player.css('top', player.position().top + travelDistanceY );
}



// method to calculate if there is any enemies within a certain radius.
function checkIfAttack(player){
	var enemiesInRange = Entities.array.filter(function (entity) {
		return entity instanceof Robot
			&& entity.team != player.team // opposite team
			&& (entity.fighting === null || entity.fighting.health > player.health ) // not attacking its lowest health enemy
			&& attackRange(player.view.position(), entity.view.position(), 100);// within range
	});
	
	if(enemiesInRange.length == 0){
		return;
	}
	
	// player attacks enemy of lowest health 
	var weakestEnemy = enemiesInRange.reduce(function(x,y){
		return x.health < y.health ? x : y;
	});
		
	player.fighting = weakestEnemy;
	attack(player);

	// have each enemy attack this player
	enemiesInRange.forEach(function (enemy) {
		if(enemy.fighting == null){
			enemy.fighting = player;
			attack(enemy);
		}
		enemy.fighting = player;

	});

}

// player and entity are jQuery Position objects
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

	enemy.damage(-5);

	if(enemy.health <= 0){
		Entities.die(enemy);
		// look around for someone else to kill!
		player.fighting = null;
		checkIfAttack(player);
	}

	setTimeout(function () {
		attack(player);
	}, 1000);
}
