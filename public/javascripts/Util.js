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
			return "#0088FF";// 100% health -> neon blue
		}
		// continuous map from x in [0,1] to an RGB triplet, red to yellow to green
		var red = Math.min(2 - 2 * x, 1);
		var green = Math.min(2 * x, 1);
		var blue = 0;

		return "rgb(" + this.pix(red) +  "," + this.pix(green) + ", " + this.pix(blue) + ")";
	},
	pix: function (x) {
		return Math.floor(255 * x);
	},

	// project: function (x, y) {
	// 	x += document.body.scrollLeft - 20;
	// 	y += document.body.scrollTop - 20;
	// 	return {left: x, top: y};
	// },

	// project: function(x, y) {
	// 	var rend = renderer.domElement;
	// 	var source = new THREE.Vector3(
	// 		(x - rend.offsetLeft) / rend.width * 2 - 1,
	// 		-(y - rend.offsetTop) / rend.height * 2 + 1,
	// 		0
	// 	);
	// 	source.unproject(camera);
	// 	var raycaster = new THREE.Raycaster(
	// 		camera.position,
	// 		source.sub(camera.position).normalize()
	// 	);
		
	// };
	convertToVectorCoords: function (x,y) {
		var vector = new THREE.Vector3();
		var renderer = env.getRenderer();
		var camera = env.getCamera();

		var widthHalf = 0.5*renderer.context.canvas.width;
		var heightHalf = 0.5*renderer.context.canvas.height;

		var newX =(x - widthHalf) / widthHalf;
		var newY = - (y - heightHalf) / heightHalf;

		return {
			x: newX,
			y: newY
		}

	},

	project: function (x, y) {
		// the plane we'll project onto, z=0
		// var planeMesh = new THREE.Mesh(
		// 	new THREE.PlaneGeometry(30, 30),
		// 	new THREE.MeshBasicMaterial()
		// );

		// essentially boilerplate
		var rend = env.getRenderer();
		var canvas = rend.domElement;
		var rect = canvas.getBoundingClientRect();
    		return {
       		 x: (x- rect.left) / (rect.right - rect.left) * canvas.width,
       		 y: (y - rect.top) / (rect.bottom - rect.top) * canvas.height
   		 };

	},


	// 	var camera = env.getCamera;

	// 	var source = new THREE.Vector3(
	// 		(x - rend.offsetLeft) / rend.width * 2 - 1,
	// 		-(y - rend.offsetTop) / rend.height * 2 + 1,
	// 		0
	// 	);

	// 	source.unproject(camera);
	// 	var raycaster = new THREE.Raycaster(
	// 		camera.position,
	// 		source.sub(camera.position).normalize()
	// 	);

	// 	var hits = raycaster.intersectObject(floor);
	// 	if (hits.length == 1) {
	// 		return hits[0].point;
	// 	}
	
	


	normalize: function (event) {
		return {
			left: event.clientX + document.body.scrollLeft,
			top: event.clientY + document.body.scrollTop
		}
	},
	generateUuid: function () {
		// TODO
		return Math.floor(Math.random() * 1e9);
	}
};