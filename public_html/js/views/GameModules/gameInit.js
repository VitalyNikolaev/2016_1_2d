define(function (require) {
    var jQuery = require('jquery');
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var World = require('views/GameModules/worldBuilder');
    var Bomb = require('views/GameModules/bomb');
    var app = require('app');
    
    var BasicScene = {
        init: function () {
            gameObjects.scene = new THREE.Scene();
            gameObjects.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000);
            gameObjects.scene.add(gameObjects.camera);
            gameObjects.light = new THREE.DirectionalLight(0xffffff, 1);
            gameObjects.light.position.set(-600, 0, -600);
            gameObjects.scene.add(gameObjects.light);
            gameObjects.light1 = new THREE.DirectionalLight(0xffffff, 1);
            gameObjects.light1.position.set(600, 1800, 600);
            gameObjects.scene.add(gameObjects.light1);
            gameObjects.light2 = new THREE.DirectionalLight(0xffffff, 1);
            gameObjects.renderer = new THREE.WebGLRenderer();
            
            Bomb.init();
            World.init();
            gameObjects.scene.add(World.mesh);

            jQuery(window).resize(function () {
                BasicScene.setAspect();
            });
            app.user.set('contentLoaded', true);
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