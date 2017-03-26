/**
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
	},

	clear: function () {
		$("#thumbnail").css("background-image", "none");
		$("#hud-bar").width(0);
		$("#health-status").text("");
		$("#type").text("");
		$("#other").text("");
	}
};


$("#build-factory").click(function (event) {
	event.stopPropagation();
	activatePlacementMode(Factory);
});
$("#build-base").click(function (event) {
	event.stopPropagation();
	activatePlacementMode(CivBase);
});
$("#build-greenhouse").click(function () {
	alert("This doesn't do anything... yet.");
});


function activatePlacementMode(GenericBuilding) {
	// menu mousemove: stop propagation, hide factory
	var building = null;
	$(document).off("click");

	$(document).mousemove(function (event) {
		var position = {
			left: event.clientX + document.body.scrollLeft,
			top: event.clientY + document.body.scrollTop
		 };
		if (building === null) {
			building = new GenericBuilding('civ1', position);
		} else {
			building.view.css(position);
		}
	});


	$(document).click(function () {
		// revert mouse behavior to deactivate placement mode
		$(document).off("click");
		$(document).on("click", goTo);
		$(document).off("mousemove");

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