/**
 * Various utility functions.
 *
 * @author Prakhar
 */

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
		if (x === 1) {
			return {r: 0, g: 0.533, b: 1};// 100% health -> neon blue
		}
		// continuous map from x in [0,1] to an RGB triplet, red to yellow to green
		return {
			r: Math.min(2 - 2 * x, 1),
			g: Math.min(2 * x, 1),
			b: 0
		}
	},

	rgbString: function (obj) {
		return "rgb(" + this.pix(obj.r) +  "," + this.pix(obj.g) + ", " + this.pix(obj.b) + ")";
	},

	pix: function (x) {
		return Math.floor(255 * x);
	},

	generateUuid: function () {
		// TODO
		return Math.floor(Math.random() * 1e9);
	}
};