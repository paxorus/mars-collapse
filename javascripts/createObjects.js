//This file sets some of the objects within the map
//It sets the circles that represent players

var numMines = 10;

var resources = {
	metal: 25,
	robot: 3
};

function updateHud() {
	$("#metal-amount").text(resources.metal);
	$("#robot-amount").text(resources.robot);
}

function startCivs(){
	//In order to add an equal number of circles for each team.. we create a "number" of div objects, then add css properties with "{class: 'civ civ1'}" and div.css(..). Finally append the div in some part of the html.
	for(var i = 0; i < resources.robot; i++){
		Entities.push(new Robot('civ1'));
		Entities.push(new Robot('civ2'));
	}

	for (var i = 0; i < numMines; i++) {
		Entities.push(new Mine(Util.pick(50, 60)));
	}

	updateHud();
}
