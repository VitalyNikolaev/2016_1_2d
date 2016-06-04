define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
	var tileFactory = require('views/GameModules/tileFactory');

    var World = {
        init: function () {
			this.mesh = new THREE.Object3D();
			
			var parent = this;
		    tileFactory.init(function () {
				
				var border = gameObjects.prefabsObjects['border'];
				border.rotation.y = Math.PI;
				border.position.set(0, 0, 0);
				parent.mesh.add(border);
				
				var hills = gameObjects.prefabsObjects['hills'];
				hills.rotation.y = - Math.PI / 2;
				hills.position.set(0, 0, 0);
				parent.mesh.add(hills);
				
				var forest = gameObjects.prefabsObjects['forest'];
				forest.rotation.y = - Math.PI / 2;
				forest.position.set(0, 0, 0);
				parent.mesh.add(forest);
				
				for (var i = 0; i < 16; i++)
					for (var j = 0; j < 16; j++)
						tileFactory.spawnRandomGroundAt(parent.mesh, i ,j)

				parent.addSkybox(parent.mesh); // create a box with panorama
				
			});
        },
        addSkybox: function (whereToAdd) {
            var imagePrefix = "media/game/skybox/panorama/";
            var directions  = ['0004.png',
                '0002.png',
                '0006.png',
                '0005.png',
                '0001.png',
                '0003.png'];
            var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
            var materialArray = [];
            for (var i = 0; i < 6; i++)
                materialArray.push(new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i]),
                    side: THREE.BackSide
                }));
            var skyMaterial = new THREE.MeshFaceMaterial(materialArray);

            var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
            whereToAdd.add(skyBox);
        }
    };
    return World
});