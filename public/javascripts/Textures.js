/**
 * @author Jasmine
 */

var Textures = {
	floor: new THREE.MeshBasicMaterial({color: 0x0088ff}),
	eskie: new THREE.MeshBasicMaterial({color: 0x0088ff}),
	beagle: new THREE.MeshBasicMaterial({color: 0x0088ff}),
	base1: new THREE.MeshBasicMaterial({color: 0x0088ff}),
	base2: new THREE.MeshBasicMaterial({color: 0x0088ff}),
	update: function (name, texture) {
		this[name].map = texture;
		this[name].color = {b: 1, g: 1, r: 1};
		this[name].needsUpdate = true;
	}
};

setTimeout(function () {
	var loader = new THREE.TextureLoader();

	loader.load('images/aridonis.jpg', function (texture) {
		Textures.update("floor", texture);
	});
	loader.load('images/eskie.jpg', function (texture) {
		Textures.update("eskie", texture);
	});
	loader.load('images/beagle.jpg', function (texture) {
		Textures.update("beagle", texture);
	});
	loader.load('images/base1.jpg', function (texture) {
		Textures.update("base1", texture);
	});
	loader.load('images/base2.jpg', function (texture) {
		Textures.update("base2", texture);
	});
}, 1000);

