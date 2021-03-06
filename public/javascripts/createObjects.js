/**
 * Holds the resources{} object and the initialize and termination procedures for the game.
 *
 * @author Jasmine
 */

var NUM_MINES = 10;
var NUM_ROBOTS = 4;

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
	// collaboratively generate the map
	for (var i = 0; i < NUM_MINES / 2; i++) {
		var position = {
			x: Util.pick(-100, 100),
			z: Util.pick(-100, 100)
		}
		var mine = new Mine(Util.pick(30, 60), position);
		Entities.push(mine);
		// socket.emit('create', serialize(mine));
	}

	// create your own civilization
	var baseTop = (My.TEAM == 'civ1') ? 80 : -80;
	var base = new CivBase(My.TEAM, {x: 0, z: baseTop});
	base.quickstart();
	Entities.push(base);

	for(var i = 0; i < NUM_ROBOTS; i++){
		var position = {
			x: Util.pick(-30, 30),
			z: (My.TEAM == 'civ1') ? 70 : -70
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