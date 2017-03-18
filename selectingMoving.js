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
	}
	playerSelected = $(event.target); //enhances the event.target (not a regular html object)
	playerSelected.css("background-color", "yellow");

	event.stopPropagation(); //Given that there is an event listener for the object and for the document as a whole, we put event.stopPropagation() so that it stops the execution of clicking the document. 

}


// document.getElementById("civ1").addEventListener("click",selectPlayer);
// document.getElementById("civ2").addEventListener("click",selectPlayer);

//This method is used to move the player 
//we use a counter variable for the movePlayer method, in order so that when a
//user clicks at a point on the screen while the player is moving, the movePlayer function for the first move stops
//(as counter will not be equal to id anymore, thus returning) and the second moving process starts
// var counter = 0;
$(document).click(function (event){
	// counter ++;
	// var id = counter;
	// console.log(id);
	if (!playerSelected) {
		return;
	}
	var player = playerSelected;
	var entity = Entities.get(player);
	entity.counter ++;// cancel all previous animations
	var id = entity.counter;
	var speed = 3;
	var targetX = event.clientX - 20;
	var targetY = event.clientY - 20;

	// console.log("initial position: " +player.position().left + "," + player.position().top)
	// console.log("Target: " + targetX +", " +targetY);
	var counter = 0;

	function movePlayer() {
		if (entity.counter != id) {  //Whats the need for this if entity.counter is always going to equal id
			return;
		}
		var position = player.position();
		var distanceX = targetX - position.left;
		var distanceY = targetY - position.top;
		var distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
		if(distance < speed){
			player.css({left: targetX, top: targetY });
			// console.log("final move: " + targetX + ", "+targetY )
			checkIfAttack()
		}else{
			counter++;
			// console.log("move number: " +counter);
			// console.log("player position: "+player.position().left + "," + player.position().top)
			// console.log(" ");
			goLeft(player,distanceX * (speed/distance));
			goUp(player,distanceY * (speed/distance));
			requestAnimationFrame(movePlayer);
		}
			
	}
	movePlayer();
});


function goLeft(player,travelDistanceX){
	player.css('left', player.position().left +  travelDistanceX )
}


function goUp(player,travelDistanceY){
	player.css('top', player.position().top + travelDistanceY )
}



//Method to calculate if there is any enemies within a certain radius. Started March 5th 2017

function checkIfAttack(){
	var range = 100;
	for(var i= 0; i < Entities.array.length; i++){
		var entity = Entities.array[i];
		var player = playerSelected;
		if(playerSelected[0] != entity && attackRange(player, entity, range)){ //As the player selected is also in the array of entitities we need to make sure that we discard the occasion when we calculate the distance between the same two entities
			var playObj = Entities.get(player)
			if(entity.team != playObj.team){ //this condition to make sure that a player only attacks someone form the opposite team
				attack(playObj,entity); //return as we dont want the computation to continue (i.e we want the object to attack the first player that is an enemy)
			} 
			
		}

	}

}


function attackRange(player,entity,range){
	var x1 = parseInt(entity.domElement.get(0).style.left)
	var y1 = parseInt(entity.domElement.get(0).style.top)
	var x2 = player.position().left;
	var y2 = player.position().top;
	if(Math.sqrt(Math.pow(Math.abs(x1-x2),2) + Math.pow(Math.abs(y1-y2),2)) < range){
		return true;
	}
}

function attack(player,enemy){

	if(attackRange(player.domElement,enemy,100)){
		//Take Health from the othe player
		$(enemy.health).css({width: parseInt(enemy.health.get(0).style.width) - 5}) 
		$(player.health).css({width: parseInt(player.health.get(0).style.width)- 4})
		//main problem is that doing this doesnt change it in the html page!
		console.log("killing")

		if(enemy.health.get(0).style.width == "0px"){
			return die(enemy);
		}
		if(player.health.get(0).style.width == "0px"){
			return die(player);
		}

		
		setTimeout(function () {
			attack(player, enemy);
		}, 2000);
		
		// if(player.health.get(0))
		// looseHealth()
		// debugger
		//The first entity (player or enemy) to reach 0 dies
		
		//Hint: Do the shooting as I have learned to done the moving
		//in a certain direction (with requestanimationframe etc)
	}
	// requestAnimationFrame(attack(player,enemy))
	
}

//kills the element by deleting the domelement and removing the entity from the arrays of entities
function die(entity){
	$(entity.domElement).remove();
	for(var i= 0; i < Entities.array.length; i++){
		var arrElement = Entities.array[i];
		if(arrElement == entity){
			Entities.array.splice(i,1)
		}
	}

}

//this function stops the execution of a thread for 7 seconds
// function wait(ms){
//    var start = new Date().getTime();
//    var end = start;
//    while(end < start + ms) {
//      end = new Date().getTime();
//   }
// }







