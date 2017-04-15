/**
 * A Factory is a Building that produces robots.
 */
class Factory extends Building {

	constructor(team, position) {
		super(team, position, 75);
		this.type = "Factory";
		this.view.addClass("factory");
		this._queue = [];
		this._timeout = null;
	}

	finish() {
		super.finish();
		if (this == selectedObject) {
			Menu.display(this);
		}
	}

 	static get cost() {
 		return [50, 0];
 	}

 	produceRobot() {
 		this._queue.push("R");
 		if (this._timeout === null) {
	 		this._timeout = setTimeout(this._dequeue.bind(this), 3000);
 		}
 	}

 	_dequeue() {
 		var next = this._queue.shift();
 		if (next == "R") {
	 		var robot = new Robot(this.team,true);
 			Entities.push(robot);
 		}
 		if (this._queue.length > 0) {
 			this._timeout = setTimeout(this._dequeue.bind(this), 3000);
 		} else {
 			this._timeout = null;
 		}
 	}

 	die() {
 		super.die();
 		clearTimeout(this._timeout);
 	}
}