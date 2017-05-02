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
		sphereMesh.position.y = 4;
		scene.add(sphereMesh);

		sphereMesh.position.x = position.left;
		sphereMesh.position.z = position.top;
		return sphereMesh;
	}

	this.addBase = function(position, team) {
		var geometry = new THREE.BoxGeometry( 20, 10, 10 );
		var material = (team == "civ1") ? Textures.base1 : Textures.base2;

		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		cube.position.x = position.left;
		cube.position.z = position.top;
		return cube;
	}

	this.addFactory = function (size, position, color) {
		// color = color || 0x444444;
		var geo = new THREE.BoxGeometry( size[0], size[1], size[2] );
		var material = new THREE.MeshBasicMaterial( {color: color} );
		var factory = new THREE.Mesh( geo, material );
		scene.add(factory);

		//factory.position.set(position[0], position[1], position[2]);
		factory.position.x = position[0];
		factory.position.z = position[1];
		
		return factory;
	};

	this.addTurretCannon = function () {
		var geometry2 = new THREE.BoxGeometry(8,1,1);
		var material2 = new THREE.MeshBasicMaterial( {color: 0xffffff });
		var turretCannon = new THREE.Mesh(geometry2, material2);
		turretCannon.position.y = 5;

		return turretCannon;
	};

	this.addTurret = function (position, color){
		var geometry1 = new THREE.BoxGeometry(14, 7, 7);
		var material1 = new THREE.MeshBasicMaterial( {color: color} );
		var turret = new THREE.Mesh(geometry1, material1);
		scene.add(turret);
		// TODO: place properly
		turret.position.x = 0;
		turret.position.z = 0;
		return turret;
	};

	this.removeObject = function(object){
		scene.remove(object);
	};

	this.addMissile = function (position) {
		var geometry = new THREE.SphereGeometry(1.5, 20, 20);
		var material = new THREE.MeshBasicMaterial({color: 0x000000});
		var missile = new THREE.Mesh(geometry,material);
		scene.add(missile);

		missile.position.x = position.x;
		missile.position.z = position.z;
		return missile
	};

	this.unproject = function (x, y) {
		var raycaster = new THREE.Raycaster();// create once
		var mouse = new THREE.Vector2();// create once
	
		mouse.x = ( x / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( y / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length == 0) {
			return null;
		}
		return intersects[0];
		// return Entities.get(intersects[0]);
	};

	this.isFloor = function (mesh) {
		return mesh == floor;
	};

	this.highlight = function () {

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

	function animate() {
		renderer.render(scene, camera);
		// camera.rotation.y = Date.now() * 0.00005;
		requestAnimationFrame(animate);
	};
}

