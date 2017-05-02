/**
 *
 * @author Jasmine
 */

function Environment() {

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.y = 90;
	camera.position.z = 90;
	camera.rotation.x = -5/16 * Math.PI;

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var listeners = [];
	this.selectedObject = null;// the last clicked object
	var floor = addFloor();
	animate();

	this.getRenderer = function (){
		return renderer;
	};

	this.getCamera = function (){
		return camera;
	};

	function addFloor() {
		var planeGeo = new THREE.PlaneGeometry(500, 500, 20, 20);
		var floor = new THREE.Mesh(planeGeo, Textures.floor);
		floor.rotation.x = - Math.PI / 2;
		scene.add(floor);
		return floor;
	};

	this.addRobot = function(position, team) {
		var sphereGeo = new THREE.SphereGeometry(3, 20, 20);
		var sphereMat = (team == "civ1") ? Textures.eskie : Textures.beagle;
		var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
		scene.add(sphereMesh);

		sphereMesh.position.x = position.x;
		sphereMesh.position.y = 4;
		sphereMesh.position.z = position.z;
		return sphereMesh;
	}

	this.addBase = function(position, team) {
		var geometry = new THREE.BoxGeometry( 20, 10, 10 );
		var material = (team == "civ1") ? Textures.base1 : Textures.base2;
		var cube = new THREE.Mesh(geometry, material);
		cube.position.set(position.x, 10, position.z);
		scene.add(cube);

		return cube;
	}

	this.addFactory = function (position) {
		var geo = new THREE.BoxGeometry(20, 10, 10);
		var factory = new THREE.Mesh(geo, Textures.factory);
		factory.position.set(position.x, 10, position.z);
		scene.add(factory);
		return factory;
	};

	var raycaster = new THREE.Raycaster();// create once
	var mouse = new THREE.Vector2();// create once

	this.unproject = function (x, y) {	
		mouse.x = ( x / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( y / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length == 0) {
			return null;
		}
		return intersects[0];
		// return Entities.get(intersects[0]);
	};

	// 2D to 3D point on plane
	this.project = function (x, y) {
		mouse.x = ( x / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( y / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		return raycaster.intersectObject(floor)[0].point;
	};

	this.isFloor = function (mesh) {
		return mesh == floor;
	};

	// start an event listener
	this.listen = function (eventType, eventHandler) {
		listeners.push([eventType, eventHandler]);
		renderer.domElement.addEventListener(eventType, eventHandler);
	};

	// kill all event listeners of some type
	this.disable = function (eventType) {
		listeners.forEach(function (data) {
			if (data[0] == eventType) {
				renderer.domElement.removeEventListener(data[0], data[1]);
			}
		});
	};

	function animate() {
		renderer.render(scene, camera);
		// camera.rotation.y = Date.now() * 0.00005;
		requestAnimationFrame(animate);
	}
}

