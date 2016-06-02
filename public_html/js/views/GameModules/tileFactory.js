define(function(require) {
	var THREE = require('three');
    var modelLoader = require('utils/modelLoader');
	var gameObjects = require('views/GameModules/gameObjects');
    var app = require('app');
	
	var undestructibleWallsCount = 3;
    //var destructibleWallsCount = 1;
	
	var cubeScale = 2.5;
	var ringScale = 1.6;
	var angleSpeedCoefficient = 0.1;
    
    
	var randomInt = function(max) {
		return Math.floor(Math.random() * max);
	};
	
	var randomRotation = function(model) {
		var bigRotation = randomInt(4); // 0, 90, 180 or 270.
		
		if (bigRotation == 0)
			model.rotation.y = Math.PI / 2;
		else if (bigRotation == 1)
			model.rotation.y = Math.PI;
		else if (bigRotation == 2)
			model.rotation.y = 3 * Math.PI / 2;
		else // if (bigRotation == 3)
			model.rotation.y = 2 * Math.PI;
			
		var smallRotation = randomInt(3); // +5, 0 or -5.
		var fiveDegrees = 4.5 * Math.PI / 180;
		
		if (smallRotation == 0)
			model.rotation.y += fiveDegrees;
		else if (smallRotation == 1)
			model.rotation.y -= fiveDegrees;
		//else // if (smallRotation == 2)
		//	nothing
		
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
                       
					    modelLoader.getModel('destructible_walls', 'crate64', function(object) {
							object.scale.set(cubeScale, cubeScale, cubeScale);
							gameObjects.prefabsObjects['destructibleCube1'] = object;
						   
							modelLoader.getModel('bonuses', 'bonusRing48', function(object) {
								object.scale.set(ringScale, ringScale, ringScale);
								gameObjects.prefabsObjects['bonusRingBig'] = object;
							   
								modelLoader.getModel('bonuses', 'bonusRing32', function(object) {
									object.scale.set(ringScale, ringScale, ringScale);
									gameObjects.prefabsObjects['bonusRingSmall'] = object;
								   
									app.Events.trigger('ModelsReady');
								});
							});
						});
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
        },
		
		spawnRandomDestructibleWallAt: function(id, x, y) {
			gameObjects.addPrefabToWorld(randomRotation(gameObjects.prefabsObjects['destructibleCube1'].clone()), id, x, y);
        },
		
		spawnBonusByNameAt: function(name, id, x, y) {
			var complexObject = {};
		
			complexObject['bonus'] = randomRotation(gameObjects.prefabsObjects[name].clone());
			complexObject['bonus'].scale.set(1,1,1);
			complexObject['ring1'] = randomRotation(gameObjects.prefabsObjects['bonusRingBig'].clone());
			complexObject['ring2'] = randomRotation(gameObjects.prefabsObjects['bonusRingBig'].clone());
			complexObject['ring3'] = randomRotation(gameObjects.prefabsObjects['bonusRingSmall'].clone());
			complexObject['objects'] = ['bonus', 'ring1', 'ring2', 'ring3'];
			complexObject['isComplexObject'] = true;	// not undefined :)
			
			var coordinates = gameObjects.getRealCoordinates(x, y);
			complexObject.bonus.position.set(coordinates.x, 32, coordinates.z);
			complexObject.ring1.position.set(coordinates.x - 8, 32, coordinates.z);
			complexObject.ring2.position.set(coordinates.x + 8, 32 + 8, coordinates.z);
			complexObject.ring3.position.set(coordinates.x, 32 + 8, coordinates.z);
			
			var deltaT = 1000 / gameObjects.fps;
			var timerID = setInterval(function () {
                //complexObject.bonus.position.y += 32 + 8 * Math.sin(complexObject.bonus.rotation.y);
                complexObject.bonus.rotation.y += angleSpeedCoefficient * -1 * Math.PI / deltaT;
                complexObject.ring1.rotation.y += angleSpeedCoefficient * 2 * Math.PI / deltaT;
                complexObject.ring2.rotation.y += angleSpeedCoefficient * -2 * Math.PI / deltaT;
                complexObject.ring3.rotation.y += angleSpeedCoefficient * 4 * Math.PI / deltaT;
            }, deltaT);
			
			complexObject['stopBehavior'] = function() {clearInterval(timerID)};
			
			gameObjects.addComplexObjectToWorld(complexObject, id);
        }
	};
	
    return tileFactory;
});