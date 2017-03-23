var Util = {
	distance: function (deltaX, deltaY) {
		return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
	},
	pick: function (a, b) {
		// gives integer in [a,b)
		return Math.floor(a + Math.random() * (b - a));
	}
};