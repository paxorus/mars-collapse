/**
 * Holds the resources{} object and the initialize and termination procedures for the game.
 *
 * @author Jasmine
 */

var NUM_MINES = 10;
var NUM_ROBOTS = 3;
var env;
var resources = {
	metal: 1000,
	robot: 0,
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

function startCivs(civ) {
	env = new Environment();
	// collaboratively generate the map
	// for (var i = 0; i < NUM_MINES / 2; i++) {
	// 	var mine = new Mine(Util.pick(50, 60));
	// 	Entities.push(mine);
	// 	socket.emit('create', serialize(mine));
	// }

	// create your own civilization
	var baseTop = (My.TEAM == 'civ1') ? 90 : 40;
	var base = new CivBase(My.TEAM, {top: baseTop, left: 50});
	base.quickstart();
	Entities.push(base);

	for(var i = 0; i < NUM_ROBOTS; i++){
		var position = {
			left: Util.pick(-80, 80),
			top: (My.TEAM == 'civ1') ? 80 : -80
		};
		Entities.push(new Robot(My.TEAM, position));
	}
	
 
	resources.update();
	Menu.display();
}

function endGame(loser) {
	// Being lazy, just print to console and change the background.
	if (loser == "civ1") {
		$("body").css("background-image", "url(images/beagle.jpg)");
	} else {
		$("body").css("background-image", "url(images/eskie.jpg)");
	}

	if (loser == My.TEAM) {
		console.log("You lose.");
	} else {
		console.log("You win!");
	}
	$("body").css("background-size", "cover");
}