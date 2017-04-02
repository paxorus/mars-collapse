/**
 * Holds the resources{} object and the initialize and termination procedures for the game.
 *
 * @author Jasmine
 */

var NUM_MINES = 10;

var resources = {
	metal: 1000,
	robot: 3,
	buy: function (entity) {
		this.pay(this.priceOfType[entity.type]);
	},
	pay: function (cost) {
		this.metal -= cost[0];
		this.robot -= cost[1];
		this.update();
	},
	update: function () {
		$("#metal-amount").text(resources.metal);
		$("#robot-amount").text(resources.robot);
		Menu.update();		
	},
	priceOfType: {
		"Factory": Factory.cost,
		"CivBase": CivBase.cost,
		"Greenhouse": [0, 0],
		"Turret": Turret.cost
	}
};

function startCivs(){
	//In order to add an equal number of circles for each team.. we create a "number" of div objects, then add css properties with "{class: 'civ civ1'}" and div.css(..). Finally append the div in some part of the html.
	var base1 = new CivBase('civ1', {top: 80, left: 400});
	base1.quickstart();
	var base2 = new CivBase('civ2', {top: 570, left: 400});
	base2.quickstart();
	Entities.push(base1, base2);

	for (var i = 0; i < NUM_MINES; i++) {
		Entities.push(new Mine(Util.pick(50, 60)));
	}

	for(var i = 0; i < resources.robot; i++){
		Entities.push(new Robot('civ1'));
		Entities.push(new Robot('civ2'));
	}

	resources.update();
	Menu.display();
}

function endGame(loser) {
	// Being lazy, just print to console and change the background.
	if (loser == "civ1") {
		console.log("You lose.");
		$("body").css("background-image", "url(images/beagle.jpg)");
	} else {
		console.log("You win!");
		$("body").css("background-image", "url(images/eskie.jpg)");
	}
	$("body").css("background-size", "cover");
}