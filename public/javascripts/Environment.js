var floor;
function Environment() {

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	//camera = new THREE.OrthographicCamera(window.innerWidth / - 5, window.innerWidth / 5, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
	camera.position.y = 200;
	camera.position.z = 200;
	camera.rotation.x = -45 * Math.PI / 180;

	var scene = new THREE.Scene();//a list of objects that affect what is displayed on the screen, such as 3D models and lights.

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	animate();

	this.addFloor = function () {
		var planeGeo = new THREE.PlaneGeometry(200, 200, 20, 20);
		var planeMat = new THREE.MeshBasicMaterial({color: 0x0088ff, overdraw: true});
		var mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.rotation.x = - Math.PI / 2;
		// mesh.rotation.y = Math.PI / 4;
		scene.add(mesh);
		return mesh;
	};

	
	this.addRobot = function(position) {
		var sphereGeo = new THREE.SphereGeometry(8, 20, 20);
		var sphereMat = new THREE.MeshBasicMaterial({color: 'pink'});
		var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
		sphereMesh.position.y = 4;
		scene.add(sphereMesh);

		sphereMesh.position.x = position.left;
		sphereMesh.position.z = position.top;
		return sphereMesh;
	}

	this.addBuilding = function(position) {
		var geometry = new THREE.BoxGeometry( 20, 10, 10 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = position.left;
		cube.position.z = position.top;
		return cube;
	}

	/**new added**/

	this.addFactory = function (size, position, color) {
		// color = color || 0x444444;
		var geo = new THREE.BoxGeometry( size[0], size[1], size[2] );
		var material = new THREE.MeshBasicMaterial( {color: color} );
		var factory = new THREE.Mesh( geo, material );
		

		factory.position.set(position[0], position[1], position[2]);
		scene.add( factory );
		return factory;
	};

	// start an event listener
	this.listen = function (eventType, eventHandler) {
		listeners.push([eventType, eventHandler]);
		renderer.domElement.addEventListener(eventType, eventHandler);
	};

	// kill all event listeners
	this.disable = function () {
		listeners.forEach(function (data) {
			renderer.domElement.removeEventListener(data[0], data[1]);
		});
	};

	/**new added**/

	function animate() {
		renderer.render(scene, camera);
		//camera.rotation.y = Date.now() * 0.00005;

		requestAnimationFrame(animate);
	}

	floor = this.addFloor();
}