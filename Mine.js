function Mine(num) {
	// this.id = id;
	this.amount = num;
	var m = $("<img>", {class: "mine", src: "metal_icon.png"});
	m.css({top: pick(70, window.innerHeight - 95), left: pick(70, window.innerWidth - 95)});
	$(document.body).append(m);

	//add up
	this.isOccupied = false;
}

function pick(a, b) {
	// gives integer in [a,b)
	return Math.floor(a + Math.random() * (b - a));
}

function Mining(robot, mine) {
	//the mine is not occupied
	if (mine.isOccupied) {
		return;
	}
	
}