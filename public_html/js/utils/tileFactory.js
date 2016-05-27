define(function(require) {
	var THREE = require('three');
    var modelLoader = require('utils/modelLoader');
	var gameObjects = require('views/GameModules/gameObjects');
	    
	var undestructibleWallsCount = 4;
	
	var randomInt = function(max) {
		return Math.floor(Math.random() * max);
	};
	
	var randomRotation = function(model) {
		var number = randomInt(4); // 0, 90, 180 or 270.
		
		if (number == 0)
			model.rotation.y = Math.PI / 2;
		else if (number == 1)
			model.rotation.y = Math.PI;
		else if (number == 2)
			model.rotation.y = 3 * Math.PI / 2;
		else // if (number == 3)
			model.rotation.y = 2 * Math.PI;
		
		return model;
	};
	
	var placeModelAt = function(model, id, x, y) {
		gameObjects.addPrefabToWorld(model, id, x, y);
	};
	
	var tileFactory = {
		spawnRandomUndestructibleWallAt: function(id, x, y) {
			var number = randomInt(undestructibleWallsCount);
			if (number == 0)
				modelLoader.getModel('example_pkg', '1m3Cube', function(object) { object.scale.set(0.064, 0.064, 0.064);   placeModelAt(randomRotation(object), id, x, y); });
			else 
				gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.indestructible_crate, new THREE.CubeGeometry(64, 64, 64), id, x, y);
		},
		
		
	};
	
    return tileFactory;
});