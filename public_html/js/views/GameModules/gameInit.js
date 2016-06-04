define(function (require) {
    var jQuery = require('jquery');
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var World = require('views/GameModules/worldBuilder');
    var cloud = require('views/GameModules/cloud');
	var globalScale = require('utils/globalScale');
    
	// var createShadowLight = function(name, x, y, z) {
	// 	var directionalLight = new THREE.PointLight(0xffffcc, 1.5, 4096 * globalScale, 0.2);
	// 	directionalLight.position.set(x, y, z);
    //
	// 	//directionalLight.castShadow = false;
	// 	//directionalLight.shadow.camera.near = 64 * globalScale;
	// 	//directionalLight.shadow.camera.far = 4096 * globalScale;
	// 	//directionalLight.shadow.mapSize.width  = 1024;
	// 	//directionalLight.shadow.mapSize.height = 1024;
	//
	// 	gameObjects[name] = directionalLight;
	// 	gameObjects.scene.add(gameObjects[name]);
	//
	// 	return directionalLight;
	// };
	//
	// var sun = null;
	
	// var rotateSun = function () {
	// 	if (sun) {
	// 		var timeToFullCycle = 120000; // ms. I.e. 120 seconds == 2 minutes
	// 		var medianHeight = 1024 * globalScale;
	// 		var deviationHeight = 512 * globalScale;
	// 		var xSemiaxis = 1280 * globalScale;
	// 		var zSemiaxis = 1024 * globalScale;
	//
	// 		var anglularSpeed = 2 * Math.PI / timeToFullCycle;	// radians per ms
	// 		sun.position.x = xSemiaxis * Math.cos(sun.angle);
	// 		sun.position.z = zSemiaxis * Math.sin(sun.angle);
	// 		sun.position.y = medianHeight + deviationHeight * Math.cos(sun.angle);	// 'cos' for 12am @ 0 angle, 'sin' for 6am (between 12pm and 12 am) @ 0 angle.
	//
	// 		sun.angle += anglularSpeed * 1000 / gameObjects.fps;	// [radians/ms] * ms since previous frame;
	// 	}
	// }
    var createShadowLight = function(name, x, y, z) {
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near    =   10;
        directionalLight.shadow.camera.far     =   4000;
        directionalLight.shadow.camera.right   =   1350;
        directionalLight.shadow.camera.left    =  -1350;
        directionalLight.shadow.camera.top     =   1350;
        directionalLight.shadow.camera.bottom  =  -1350;
        directionalLight.shadow.mapSize.width  = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.target.position.set(0, 0, 0);

        gameObjects[name] = directionalLight;
        gameObjects.scene.add(gameObjects[name]);
    };

    var BasicScene = {
        init: function () {
            gameObjects.scene = new THREE.Scene();
            gameObjects.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
            gameObjects.scene.add(gameObjects.camera);
            gameObjects.ambientLight = new THREE.AmbientLight(0x2f2f2f);
            gameObjects.scene.add(gameObjects.ambientLight);
            createShadowLight('light1', 0, 1800, -600);
			gameObjects.ambientLight = new THREE.AmbientLight(0x7f7f7f);
			gameObjects.scene.add(gameObjects.ambientLight);
            gameObjects.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true});

			// gameObjects.renderer.shadowMap.enabled = false;
			//gameObjects.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
           
            // sun = createShadowLight('sunLight', 0, 1024, 0);
            // sun['angle'] = 0;
            
			World.init();
            for (var i = 1; i < 5; i++) {
                var fCloud = new cloud.init();
                fCloud.angle = i;
                var randInt = Math.floor(Math.random() * (1024 - 800 + 1) + 512) * globalScale;
                fCloud.randInt = randInt;
                fCloud.particleGroup.mesh.position.set(randInt * 1.4 * Math.cos(fCloud.angle), randInt / 3 , randInt * 1.4 * Math.sin(fCloud.angle));
                gameObjects.clouds[i] = fCloud;
                gameObjects.scene.add(fCloud.particleGroup.mesh);
            }
            gameObjects.scene.add(World.mesh);

            jQuery(window).resize(function () {
                BasicScene.setAspect();
            });
        },
        addToDOM: function () {
            this.container = $('#game-canvas');
            this.container.prepend(gameObjects.renderer.domElement);
            this.setAspect();
        },
        setAspect: function () {
            this.container = $('#game-canvas');
            var w = this.container.width();
            var h = jQuery(window).height();
            gameObjects.renderer.setSize(w, h);
            gameObjects.camera.aspect = w / h;
            gameObjects.camera.updateProjectionMatrix();
        },

        frame: function () {
            gameObjects.playersCharacter.sendDirectionWS();
            gameObjects.playersCharacter.setFocus(gameObjects.playersCharacter.mesh , gameObjects.playersCharacterLook);
            gameObjects.renderer.render(gameObjects.scene, gameObjects.camera);
			for (var rey in gameObjects.bombReys) {
                if (gameObjects.bombReys.hasOwnProperty(rey)) {
                    gameObjects.bombReys[rey].group.tick();
                    gameObjects.bombReys[rey].shockwaveGroup.tick();
                }
            }
            for (var rey in gameObjects.clouds) {
                if (gameObjects.clouds.hasOwnProperty(rey)) {
                    gameObjects.clouds[rey].particleGroup.tick();
                    gameObjects.clouds[rey].angle += 0.001;
                    gameObjects.clouds[rey].particleGroup.mesh.position.x = gameObjects.clouds[rey].randInt * 1.4 * Math.cos(gameObjects.clouds[rey].angle);
                    gameObjects.clouds[rey].particleGroup.mesh.position.z = gameObjects.clouds[rey].randInt * 1.4 * Math.sin(gameObjects.clouds[rey].angle)
                }
            }
			// rotateSun();
			jQuery('#game').focus();
        },
        dealloc: function () {
            gameObjects.scene = null;
            gameObjects.camera = null;
            gameObjects.cameraControls = null;
            gameObjects.light = null;
            gameObjects.renderer = null;
            gameObjects.playersCharacter = null;
            gameObjects.objects = {};
			gameObjects.bombReys = {};
            gameObjects.clouds = {};
            gameObjects.playerNicks = {};
            gameObjects.playersCharacterLook = 0;
        }
    };


    return BasicScene;
});