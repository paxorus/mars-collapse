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