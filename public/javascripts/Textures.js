/**
 * @author Jasmine
 */

var Textures = {
	default: function (names) {
		names.forEach(function (name) {
			Textures[name] = new THREE.MeshBasicMaterial({color: 0x0088ff});
		});
	},
	shadow: function (names) {
		var shadowNames = names.map(function (x) {
			return x + "Shadow";
		});
		this.default(shadowNames);
		names.forEach(function (name) {
			Textures[name].shadow = Textures[name + "Shadow"];
			Textures[name + "Shadow"].shadow = Textures[name];
		});
	},
	update: function (name, texture, color) {
		this[name].map = texture;
		this[name].color = color || {r: 1, g: 1, b: 1};
		this[name].needsUpdate = true;
	},
	bind: function (name, texture) {
		var shadowName = name + "Shadow";
		Textures.update(name, texture);// fully lit
		if (this[name].shadow) {
			Textures.update(shadowName, texture, {r: 0.3, g: 0.3, b: 0.3});// dark
		}
	}
};


(function () {
	Textures.default(["floor", "eskie", "beagle", "base1", "base2", "factory", "mine", "turret"]);
	Textures.shadow(["base1", "base2", "factory", "turret"]);

	Textures.turret.color.setHex(0x009999);
	Textures.turretShadow.color.setHex(0x002e14);

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
		Textures.bind("base1", texture);
	});
	loader.load('images/base2.jpg', function (texture) {
		Textures.bind("base2", texture);
	});
	loader.load('images/factory.jpg', function (texture) {
		Textures.bind("factory", texture);
	});
	loader.load('images/metal_icon.png', function (texture) {
		Textures.bind("mine", texture);
	});
})();
