//This file sets some of the objects within the map
//It sets the circles that represent players
var number = 3;
function startCivs(){
		//In order to add an equal number of circles for each team.. we create a "number" of div objects, then add css properties with "{class: 'civ civ1'}" and div.css(..). Finally append the div in some part of the html.
	for(var i = 0; i < number; i++){
		Entities.push(new Robot('civ1'));
		Entities.push(new Robot('civ2'));
	}



	for (var i = 0; i < 10; i++) {

		Entities.push(new Mine(50 + Math.floor(Math.random() * 10)));
	}
}

