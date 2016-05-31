define(function(require) {
	var THREE = require('three');
    var modelLoader = require('utils/modelLoader');
	var gameObjects = require('views/GameModules/gameObjects');
    var app = require('app');
	var undestructibleWallsCount = 3;
    var destructibleWallsCount = 2;
	
	var cubeScale = 2.6;
    
    
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
   
	var tileFactory = {
        init: function () {
            modelLoader.getModel('undestructible_walls', 'rock1uvw64', function(object) {
                object.scale.set(cubeScale, cubeScale, cubeScale);
                gameObjects.prefabsObjects['indestructibleCube1'] = object;
				// Nested loading... ok.
				modelLoader.getModel('undestructible_walls', 'rock2uvw64', function(object) {
					object.scale.set(cubeScale, cubeScale, cubeScale);
					gameObjects.prefabsObjects['indestructibleCube2'] = object;
				
					modelLoader.getModel('undestructible_walls', 'rock3uvw64', function(object) {
						object.scale.set(cubeScale, cubeScale, cubeScale);
						gameObjects.prefabsObjects['indestructibleCube3'] = object;
                       
                        app.Events.trigger('ModelsReady');
					});
				});
            });
        },
        
		spawnRandomIndestructibleWallAt: function(id, x, y) {
			var number = randomInt(undestructibleWallsCount);
			if (number == 0) {
                gameObjects.addPrefabToWorld(randomRotation(gameObjects.prefabsObjects['indestructibleCube1'].clone()), id, x, y);
            } else if (number == 1) {
                gameObjects.addPrefabToWorld(randomRotation(gameObjects.prefabsObjects['indestructibleCube2'].clone()), id, x, y);
            } else {
                gameObjects.addPrefabToWorld(randomRotation(gameObjects.prefabsObjects['indestructibleCube3'].clone()), id, x, y);
            }
        }
	};
	
    return tileFactory;
});