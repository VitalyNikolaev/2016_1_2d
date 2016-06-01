define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
	var modelLoader = require('utils/modelLoader');


    var World = {
        init: function () {
            var ground = new THREE.PlaneGeometry(2048, 2048);
            var grassTexture = new THREE.TextureLoader().load('media/game/textures/grass.jpg');
            grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
            grassTexture.repeat.set(2, 2);
            var groundMaterial = new THREE.MeshPhongMaterial({map: grassTexture});
            var walls = [
                new THREE.BoxGeometry(2048, 64, 64),
                new THREE.BoxGeometry(2176, 64, 64),
                new THREE.BoxGeometry(2048, 64, 64),
                new THREE.BoxGeometry(2176, 64, 64)
            ];
            var texture_wall = new THREE.TextureLoader().load('media/game/textures/grey_bricks2.jpg');
            texture_wall.wrapS = texture_wall.wrapT = THREE.RepeatWrapping;
            texture_wall.repeat.set(24, 1);
            texture_wall.minFilter = THREE.LinearFilter;
            var wallMaterial = new THREE.MeshPhongMaterial({map: texture_wall});

            this.addSkybox(); // create a box with panorama

            this.mesh = new THREE.Object3D();
            this.ground = new THREE.Mesh(ground, groundMaterial);
            this.ground.rotation.x = -Math.PI / 2;
            this.mesh.add(this.ground);

            this.walls = [];
            for (var i = 0; i < walls.length; i += 1) {
                this.walls.push(new THREE.Mesh(walls[i], wallMaterial));
                this.walls[i].position.y = 32;
                this.mesh.add(this.walls[i]);
            }

            this.walls[0].rotation.y = -Math.PI / 2;
            this.walls[0].position.x = 1056 ;
            this.walls[1].rotation.y = Math.PI;
            this.walls[1].position.z = 1056;

            this.walls[2].rotation.y = Math.PI / 2;
            this.walls[2].position.x = -1056;

            this.walls[3].position.z = -1056;
        },
        addSkybox: function () {
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
            gameObjects.scene.add(skyBox);
        }
    };
    return World
});