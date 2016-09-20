define(function(require) {
	'use strict';
    var getModel = require('utils/modelLoader');
	var gameObjects = require('views/GameModules/gameObjects');
    var app = require('app');
	var bonusParticles = require('views/GameModules/bonusParticles');
	var globalScale = require('utils/globalScale');
	
	var undestructibleWallsCount = 3;
	var groundCount = 5;
	
	var cubeScale = 2.5 * globalScale;
	var ringScale = 1.8 * globalScale;
	var defaultBonusScale = 0.01 * globalScale;
	var cmToUnitsScale = (128 / 50.394) * globalScale; // 2.539984918839544390205183156725
	var angleSpeedCoefficient = 0.1;
	var fps = 60;
	var numberOfFramesToFullyGrownBonus = fps * 0.35; // 0.35 of second
    
    
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
		return model;
	};
   
	var bonusSpawnScaleTransistion = function(object, stepNum, targetScale) {
		var currentScale = (targetScale / numberOfFramesToFullyGrownBonus) * stepNum + 0.01;
		
		if (currentScale > targetScale)
			currentScale = targetScale;
		object.scale.set(currentScale, currentScale, currentScale);
	};
   
	var tileFactory = {
        init: function (callback) {
			if (gameObjects.prefabsObjects['player_body_blue']) {
				callback();
				app.Events.trigger('ModelsReady');
				return
			}
			var models = [];

			models.push(new Promise(function (resolve, reject) {
				getModel('undestructible_walls', 'rock1uvw64', function(object) {
					object.scale.set(cubeScale, cubeScale, cubeScale);
					gameObjects.prefabsObjects['indestructibleCube1'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('undestructible_walls', 'rock2uvw64', function (object) {
					object.scale.set(cubeScale, cubeScale, cubeScale);
					gameObjects.prefabsObjects['indestructibleCube2'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('undestructible_walls', 'rock3uvw64', function(object) {
					object.scale.set(cubeScale, cubeScale, cubeScale);
					gameObjects.prefabsObjects['indestructibleCube3'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('destructible_walls', 'crate64', function (object) {
					object.scale.set(cubeScale, cubeScale, cubeScale);
					gameObjects.prefabsObjects['destructibleCube1'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'bonusRing48', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['bonusRingBig'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'bonusRing32', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['bonusRingSmall'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'heart', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['heart'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'shield', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['shield'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', '4arrows', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['4arrows'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'onemorebomb', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['onemorebomb'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'time', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['time'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'death', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['death'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('bonuses', 'boots', function (object) {
					object.scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
					gameObjects.prefabsObjects['boots'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_body', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_body_white'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_l_hand', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_l_hand'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_r_hand', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_r_hand'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_l_foot', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_l_foot'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_r_foot', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_r_foot'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('bomb', 'Bomb', function (object) {
					object.scale.set(cmToUnitsScale * 2, cmToUnitsScale * 2, cmToUnitsScale * 2);
					gameObjects.prefabsObjects['bomb'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'border', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['border'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'hills', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['hills'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'forest', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['forest'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'grnd1', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['ground1'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'grnd2', function(object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['ground2'] = object;
					resolve();
				});
		}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'grnd3', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['ground3'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'grnd4', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['ground4'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('env', 'grnd5', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['ground5'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_body_red', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_body_red'] = object;
					resolve();
				});
			}));
			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_body_green', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_body_green'] = object;
					resolve();
				});
			}));

			models.push(new Promise(function (resolve, reject) {
				getModel('player', 'player_body_blue', function (object) {
					object.scale.set(cmToUnitsScale, cmToUnitsScale, cmToUnitsScale);
					gameObjects.prefabsObjects['player_body_blue'] = object;
					resolve();
				});
			}));

			Promise.all(models).then(function() {
				callback();
				app.Events.trigger('ModelsReady');
			});
        },
        
		spawnRandomGroundAt: function(whereToAdd, i, j) {
			var number = randomInt(groundCount);
			var ground;
			if (number == 0) {
                ground = gameObjects.prefabsObjects['ground1'].clone();
            } else if (number == 1) {
                ground = gameObjects.prefabsObjects['ground2'].clone();
            } else if (number == 2) {
                ground = gameObjects.prefabsObjects['ground3'].clone();
            } else if (number == 3) {
                ground = gameObjects.prefabsObjects['ground4'].clone();
            } else {
                ground = gameObjects.prefabsObjects['ground5'].clone();
			}
			ground.rotation.y = Math.PI;
			ground.position.set((i * 128 - 960) * globalScale,0 ,(j * 128 - 960) * globalScale);
			whereToAdd.add(ground);
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
		
		spawnBombAt: function(id, x, y) {
			gameObjects.addPrefabToWorld(randomRotation(gameObjects.prefabsObjects['bomb'].clone()), id, x, y);
        },
		
		spawnSmallLight: function(complexObject, color) {	
			return spawnSmallLight(complexObject, color);
		},
	
		spawnBonusByNameAt: function(name, id, x, y) {
			var complexObject = { growthStep: 0, position: {x: x, y: 96 * globalScale, z: y} };
			var shouldSpawn4thRing = randomInt(2) == 1;
			var shouldSpawn5thRing = randomInt(2) == 1;

			var particleEmitter  = new bonusParticles.init();
			complexObject['bonusParticles'] = particleEmitter.group.mesh;
						
			complexObject['bonus'] = randomRotation(gameObjects.prefabsObjects[name].clone());
			complexObject['bonus'].scale.set(defaultBonusScale, defaultBonusScale, defaultBonusScale);
			complexObject['ring1'] = randomRotation(gameObjects.prefabsObjects['bonusRingBig'].clone());
			complexObject['ring2'] = randomRotation(gameObjects.prefabsObjects['bonusRingBig'].clone());
			complexObject['ring3'] = randomRotation(gameObjects.prefabsObjects['bonusRingSmall'].clone());
			complexObject['objects'] = ['bonus', 'ring1', 'ring2', 'ring3', 'bonusParticles'];
			complexObject['isComplexObject'] = true;	// not undefined :)

			var coordinates = gameObjects.getRealCoordinates(x, y);
			complexObject.bonus.position.set(coordinates.x, 52 * globalScale, coordinates.z);
			complexObject.ring1.position.set(coordinates.x - 8 * globalScale, 52 * globalScale, coordinates.z);
			complexObject.ring2.position.set(coordinates.x + 8 * globalScale, 60 * globalScale, coordinates.z);
			complexObject.ring3.position.set(coordinates.x, 60 * globalScale, coordinates.z);
			complexObject.bonusParticles.position.set(coordinates.x, 52 * globalScale, coordinates.z);

			if (shouldSpawn4thRing) {
				complexObject['ring4'] = randomRotation(gameObjects.prefabsObjects['bonusRingSmall'].clone());	
				complexObject.ring4.position.set(coordinates.x, 44 * globalScale, coordinates.z + 8 * globalScale);
				complexObject.objects.push('ring4');
			}
			if (shouldSpawn5thRing) {
				complexObject['ring5'] = randomRotation(gameObjects.prefabsObjects['bonusRingBig'].clone());	
				complexObject.ring5.position.set(coordinates.x, 52 * globalScale, coordinates.z - 8 * globalScale);
				complexObject.ring5.rotation.x = Math.PI / (2.1 + randomInt(91) / 100);
				complexObject.objects.push('ring5');
			}
			
			//var light = spawnSmallLight(complexObject, 0xf6eb13);
			
			var deltaT = 1000 / fps;
			var timerID = setInterval(function () {
                complexObject.bonus.position.y = 52 * globalScale + 9 * globalScale * Math.sin(2 * complexObject.bonus.rotation.y);
				
                complexObject.bonus.rotation.y += angleSpeedCoefficient * -1 * Math.PI / deltaT;
                complexObject.ring1.rotation.y += angleSpeedCoefficient * 2 * Math.PI / deltaT;
                complexObject.ring2.rotation.y += angleSpeedCoefficient * -2 * Math.PI / deltaT;
                complexObject.ring3.rotation.y += angleSpeedCoefficient * 4 * Math.PI / deltaT;

				bonusSpawnScaleTransistion(complexObject.bonus, complexObject.growthStep, 1.4 * globalScale);
				bonusSpawnScaleTransistion(complexObject.ring1, complexObject.growthStep, ringScale);
				bonusSpawnScaleTransistion(complexObject.ring2, complexObject.growthStep, ringScale);
				bonusSpawnScaleTransistion(complexObject.ring3, complexObject.growthStep, ringScale);
				
                complexObject.bonusParticles.y = complexObject.bonus.position.y;
				//light.position.y = complexObject.bonus.position.y;
				particleEmitter.group.tick();
				
				if (shouldSpawn4thRing) {
					complexObject.ring4.rotation.y += angleSpeedCoefficient * -3 * Math.PI / deltaT;
					bonusSpawnScaleTransistion(complexObject.ring4, complexObject.growthStep, ringScale);
					}
				if (shouldSpawn5thRing) {
					complexObject.ring5.rotation.y += angleSpeedCoefficient * 2.5 * Math.PI / deltaT;
					bonusSpawnScaleTransistion(complexObject.ring5, complexObject.growthStep, ringScale);
					}
					
				complexObject.growthStep++;

            }, deltaT);
			
			complexObject['stopBehavior'] = function() {clearInterval(timerID)};

			gameObjects.addComplexObjectToWorld(complexObject, id);
        }
	};
	
	var spawnSmallLight = function(complexObject, color) {
		complexObject.objects.push('light');
		var directionalLight = new THREE.PointLight(color, 1.5, 128 * globalScale, 1);
		directionalLight.position.set(complexObject.position.x, complexObject.position.y, complexObject.position.z);

		/*directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 32 * globalScale;
		directionalLight.shadow.camera.far = 128 * globalScale;
		directionalLight.shadow.mapSize.width  = 128;
		directionalLight.shadow.mapSize.height = 128;
		*/
		complexObject['light'] = directionalLight;
		
		return directionalLight;
	};
	
    return tileFactory;
});