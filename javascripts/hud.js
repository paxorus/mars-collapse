/**
 * Contains the Profile and Menu objects, as well as the menu button actions.
 * 
 * @author Jasmine, Prakhar
 */
var Profile = {
	update: function (entity, color) {
		if (entity == selectedObject) {
			$("#hud-bar").width(100 * entity.health / entity.initialHealth);
			$("#hud-bar").css("background-color", color);
			$("#health-status").text(entity.health + "/" + entity.initialHealth);
		}
	},

	display: function (entity) {
		var backImage = entity.view.css("background-image");
		if (backImage) {
			$("#thumbnail").css("background-image", backImage);
		}

		$("#hud-bar").width(100 * entity.health / entity.initialHealth);
		$("#hud-bar").css("background-color", entity.healthBar.css("background-color"));
		$("#health-status").text(entity.health + "/" + entity.initialHealth);
		$("#type").text(entity.team + " " + entity.type);
		$("#other").text("");
		Menu.display(entity);
	},

	clear: function () {
		$("#thumbnail").css("background-image", "none");
		$("#hud-bar").width(0);
		$("#health-status").text("");
		$("#type").text("");
		$("#other").text("");
	}
};

var Menu = {
	currentSubmenu: $("#default-submenu"),
	buildingShadow: null,
	switchShadow: function (building) {
		if (this.buildingShadow !== null) {
			this.buildingShadow.die();
		}
		this.buildingShadow = building;
	},
	display: function (entity) {
		if (entity instanceof Factory && entity.status == "complete") {
			this.show("#factory-submenu");
		} else {
			this.show("#default-submenu");
		}
	},
	show: function (id) {
		this.currentSubmenu.hide();
		this.currentSubmenu = $(id);
		this.currentSubmenu.show();
		this.update();
	},
	update: function () {
		var buttons = this.currentSubmenu.children();
		buttons.each(function () {
			if (Menu.canAfford(this.id)) {
				$(this).css({pointerEvents: "auto", opacity: 1});
			} else {
				$(this).css({pointerEvents: "none", opacity: 0.5});
			}
		});
	},
	canAfford: function (id) {
		var cost = this.priceOfId[id];
		return cost[0] <= resources.metal;
	},
	priceOfId: {
		"build-factory": Factory.cost,
		"build-base": CivBase.cost,
		"build-greenhouse": [0, 0],
		"build-robot": Robot.cost,
		"build-turret": Turret.cost
	}
};

$("#hud-display").click(function (event) {
	// prevent placing buildings behind HUD
	event.stopPropagation();
});

$("#build-factory").click(function (event) {
	event.stopPropagation();
	var factory = new Factory('civ1', Util.normalize(event));
	activatePlacementMode(factory);
});
$("#build-base").click(function (event) {
	event.stopPropagation();
	var base = new CivBase('civ1', Util.normalize(event));
	activatePlacementMode(base);
});
$("#build-greenhouse").click(function (event) {
	event.stopPropagation();
	alert("This doesn't do anything... yet.");
});
$("#build-robot").click(function (event) {
	event.stopPropagation();
	resources.pay(Robot.cost);
	selectedObject.produceRobot();
});
$("#build-turret").click(function (event) {
	event.stopPropagation();
	var turret = new Turret('civ1', Util.normalize(event));
	activatePlacementMode(turret);
});

function activatePlacementMode(building) {
	Menu.switchShadow(building);

	// change mouse behavior so building shadow follows cursor
	$(document).off("click");
	$(document).mousemove(function (event) {
		building.view.css(Util.normalize(event));
	});


	$(document).click(function () {
		// revert mouse behavior to deactivate placement mode
		$(document).off("click");
		$(document).on("click", goTo);
		$(document).off("mousemove");

		resources.buy(building);
		Menu.buildingShadow = null;
		goAndBuild(building);
	});
}

function goAndBuild(building) {

	Entities.push(building);
	building.start();

	if (!Entities.myRobot(selectedObject)) {
		return;
	}
	var robot = selectedObject;
	var target = Util.project(event.clientX, event.clientY);
	robot.go(target, function () {
		robot.build(building);
	});
}