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
		

		factory.position.set(position[0], position[1], position[2]);
		scene.add(factory);
		return factory;
	};

	this.selectMesh = function (event){
		var raycaster = new THREE.Raycaster(); // create once
		var mouse = new THREE.Vector2(); // create once
	
		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( scene.children );
		if(intersects.length == 0){ //if no mesh is selected return
			return;
		}
		
		console.log(intersects);
		return Entities.get(intersects[0]); //pass the first object found 
	
	}

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
	}


	this.selectedMesh = null;// the last clicked object

	this.listen("click", function (event) {
		console.log("here");
		env.selectMesh(event);
	});

	this.listen("contextmenu", function (event) {
		if(selectedObject){
			selectedObject.view.css("opacity", 1);
			selectedObject = null;
			Profile.clear();
		}
		event.preventDefault();
	});
}

