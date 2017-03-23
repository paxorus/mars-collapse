var resources = {
	metal: 25,
	robot: 5
};

function hud() {
	$("#metal-amount").text(resources.metal);
	$("#robot-amount").text(resources.robot);
}
