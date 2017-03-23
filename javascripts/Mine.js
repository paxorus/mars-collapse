function Mine(num) {
	this.amount = num;
	var m = $("<img>", {class: "mine", src: "images/metal_icon.png"});
	m.css({
		top: Util.pick(70, window.innerHeight - 95),
		left: Util.pick(70, window.innerWidth - 95)
	});
	this.view = m;
	$(document.body).append(m);

	//add up
	this.isOccupied = false;
}

function Mining(robot, mine) {
	//the mine is not occupied
	if (mine.isOccupied) {
		return;
	}
}