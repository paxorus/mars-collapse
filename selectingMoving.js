//Js code for the Age of Empires like game. Started in February 2017.

var playerSelected = null; //We define a global variable selectedPlayer. Global variables are defined at the beggining of the javascript block so they can be called by any function. 
// var player1Color = "blue";
// var player2Color = "green";
var colorOf = {
	"civ1": "blue",
	"civ2": "brown"
};	
	

//##################################

function selectPlayer(event){
	if(event.target.className == 'health'){ //This is used in order for the health bar not to turn yellow when its clicked
		return;
	}

	if(playerSelected){
		// counter ++; // the counter has to increase here to stop the move player function
		playerSelected.css("background-color", colorOf[playerSelected.attr('class')]);
		playerSelected.css("opacity", 1);
	}
	playerSelected = $(event.target); //enhances the event.target (not a regular html object)
	playerSelected.css("background-color", "yellow");
	playerSelected.css("opacity", 0.75);

	event.stopPropagation(); //Given that there is an event listener for the object and for the document as a whole, we put event.stopPropagation() so that it stops the execution of clicking the document. 

}


//This method is used to move the player 
//we use a counter variable for the movePlayer method, in order so that when a
//user clicks at a point on the screen while the player is moving, the movePlayer function for the first move stops
//(as counter will not be equal to id anymore, thus returning) and the second moving process starts
$(document).click(function (event){
	if (!playerSelected) {
		return;
	}
	// var view = $(playerSelected;
	var entity = Entities.get($(playerSelected));
	// checkIfAttack(entity.fighting);
	entity.fighting = null;
	var view = entity.view;
	entity.counter ++;// cancel all previous animations
	var id = entity.counter;
	var speed = 3;
	var targetX = event.clientX - 20;
	var targetY = event.clientY - 20;

	// var counter = 0;

	function movePlayer() {
		if (entity.counter != id) {  //Whats the need for this if entity.counter is always going to equal id
			return;
		}
		var position = view.position();
		var distanceX = targetX - position.left;
		var distanceY = targetY - position.top;
		var distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
		if(distance < speed){
			view.css({left: targetX, top: targetY });
			checkIfAttack(entity);
		}else{
			// counter++;
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



//Method to calculate if there is any enemies within a certain radius. Started March 5th 2017

function checkIfAttack(player){
	var range = 100;
	// var player = Entities.get(playerSelected);
	var enemiesInRange = Entities.array.filter(function (entity) {
		return entity.team != player.team  
			&& (entity.fighting === null || entity.fighting.health > player.health ) //entity.fighting.health is the health of the entity the current enemy is fighting. If its more than 
			&& attackRange(player.view.position(), entity.view.position(), range);
			// triple equals so that entity.fighting is exactly null.. not 0 or false, empty string, NaN (all the falsy values)
			// double equals to check if two things are falsy or truthy
	});
	
	if(enemiesInRange.length == 0){
		// player.fighting = null;
		return;
	}
	
	
	//	player attacks enemy of lowest health 
	var weakestEnemy = enemiesInRange.reduce(function(x,y){
		return x.health < y.health?x:y;
	});
		
	player.fighting = weakestEnemy;
	attack(player);
	// indicate that player is engaged in fighting
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
	var deltaX = entity.left - player.left;
	var deltaY = entity.top - player.top;
	return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2)) < range;

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
		player.fighting = null;
		// look around for someone else to kill!
		checkIfAttack(player);
	}
	// if(player.health <= 0){
	// 	Entities.die(player);
	// 	// look around for someone else to kill!
	// 	checkIfAttack(enemy);
	// }

	setTimeout(function () {
		attack(player);
	}, 1000);
	
	
	
}
