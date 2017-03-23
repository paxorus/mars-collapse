var Util = {
	distance: function (deltaX, deltaY) {
		// Euclidean distance
		return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
	},
	pick: function (a, b) {
		// gives integer in [a,b)
		return Math.floor(a + Math.random() * (b - a));
	},
	rybCurve: function (x) {
		// continuous map from x in [0,1] to an RGB triplet, red to yellow to green
		var red = Math.min(1 - x / 2, 1);
		var green = Math.min(2 * x, 1);
		var blue = 0;

		return "rgb(" + this.pix(red) +  "," + this.pix(green) + ", " + this.pix(blue) + ")";
	},
	pix: function (x) {
		return Math.floor(255 * x);
	}
};