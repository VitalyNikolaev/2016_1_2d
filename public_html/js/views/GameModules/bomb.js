define(function (require) {
    var THREE = require('three');
    var OBJLoader = require('OBJLoader');
    var loader = new THREE.OBJLoader();
    var gameObjects = require('views/GameModules/gameObjects');
	var globalScale = require('utils/globalScale');
	
    var bomb = {
        init: function () {
            loader.load('../media/game/models/bomb/Bomb.obj', function (object) {
                var texture = THREE.ImageUtils.loadTexture('../media/game/models/bomb/texture.png', {}, function () {
                    gameObjects.renderer.render(gameObjects.scene, gameObjects.camera);
                });
                var materialObj = new THREE.MeshBasicMaterial({map: texture});
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = materialObj;
                        child.scale.set(5 * globalScale, 5 * globalScale, 5 * globalScale)
                    }
                });
                gameObjects.bombObj = object;
            });
        },
       

    };
    return bomb

});