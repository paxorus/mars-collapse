/**
 * Contains the Profile and Menu objects, as well as the menu button actions.
 * 
 * @author Jasmine, Prakhar
 */
var Profile = {
	update: function (entity, color) {
		if (entity == env.selectedObject) {
			$("#hud-bar").width(100 * entity.health / entity.initialHealth);
			$("#hud-bar").css("background-color", color);
			$("#health-status").text(entity.health + "/" + entity.initialHealth);
		}
	},

	display: function (entity) {
		var mesh = entity.view;
		if (entity instanceof Mine) {
			mesh = mesh.children[0];
		}
		var backImage = mesh.material.map.image;
		if (backImage) {
			var url = "url(" + backImage.src + ")";
			$("#thumbnail").css("background-image", url);
		}

		$("#hud-bar").width(100 * entity.health / entity.initialHealth);
		$("#hud-bar").css("background-color", Util.rgbString(entity.healthBar.material.color));
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
	var factory = new Factory(My.TEAM, env.project(event.clientX, event.clientY));
	activatePlacementMode(factory);
});

$("#build-base").click(function (event) {
	event.stopPropagation();
	var base = new CivBase(My.TEAM, env.project(event.clientX, event.clientY));
	activatePlacementMode(base);
});

$("#build-turret").click(function (event) {
	event.stopPropagation();
	var turret = new Turret(My.TEAM, env.project(event.clientX, event.clientY));
	activatePlacementMode(turret);
});

$("#build-robot").click(function (event) {
	event.stopPropagation();
	resources.pay(Robot.cost);
	env.selectedObject.produceRobot();
});


function activatePlacementMode(building) {
	Menu.switchShadow(building);

	// change mouse behavior so building shadow follows cursor
	env.disable("click");
	env.listen("mousemove", function (event) {
		var position = env.project(event.clientX, event.clientY);
		building.view.position.x = position.x;
		building.view.position.z = position.z;
	});


	env.listen("click", function () {
		// revert mouse behavior to deactivate placement mode
		env.disable("click");
		env.disable("mousemove");
		env.listen("click", handleClick);

		resources.buy(building);
		Menu.buildingShadow = null;
		goAndBuild(building);
	});
}

function goAndBuild(building) {

	Entities.push(building);
	building.start();

	if (!Entities.myRobot(env.selectedObject)) {
		return;
	}
	var robot = env.selectedObject;
	var target = env.project(event.clientX, event.clientY);
	robot.build(building, target);
}