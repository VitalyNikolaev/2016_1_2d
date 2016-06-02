define(function (require) {
    var jQuery = require('jquery');
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var World = require('views/GameModules/worldBuilder');
    
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
		directionalLight.target.position.set(0, 0, 0)
		
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
            //createShadowLight('light2', 0, 1800, 600);
			//createShadowLight('light3', -600, 1800, 0);
            //createShadowLight('light4', 600, 1800, 0);
            gameObjects.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true, premultipliedAlpha: true });

			gameObjects.renderer.shadowMap.enabled = true;
			gameObjects.renderer.shadowMap.type = THREE.BasicShadowMap;		
           
            World.init();
            
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
			jQuery('#game').focus();
        },
        dealloc: function () {
            gameObjects.scene = undefined;
            gameObjects.camera = undefined;
            gameObjects.cameraControls = undefined;
            gameObjects.light = undefined;
            gameObjects.renderer = undefined;
            gameObjects.playersCharacter = undefined;
            gameObjects.objects = {};
            gameObjects.playersCharacterLook = 0;
        }
    };

    return BasicScene;
});