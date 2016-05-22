define(function (require) {
    var THREE = require('three');
    var objects = {
        scene: null,
        camera: null,
		cameraControls: null,
        light: null,
        renderer: null,
        playersCharacter: null,
        playersCharacterLook: 950,
        fps: 0, // needed to move bomber sync to server
        objects: {}, // here we dump all links to obstacle index by id of object
        bombObj: null,
        worldObjects: {
            indestructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/grey_bricks2.jpg')}),
            destructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/destruct_crate.gif')}),
            bomb_bonus_range: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/bonus_bomb.gif')}),
            explosion_rey: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/explosion.jpg')}),
        },
        getRealCoordinates: function (x, z) {
            return {
                x: x * 64 - 992,
                z: z * 64 - 992
            }
        },
        getBomberManRealCoordinates: function (x, z) {
            return {
                x: x * 64 - 1024,
                z: z * 64 - 1024
            }
        },
		addPrefabToWorld: function (model, id, x, z) { // needed to place objects by x, y and its id
            var coordinates = this.getRealCoordinates(x, z);
            model.position.set(coordinates.x, 32, coordinates.z);
            this.objects[id] = {
                index: model
            };
            this.scene.add(model);
        },
        addObjectToWorldWithNoCollisions: function (type, obj_geometry, id, x, z) { // needed to place objects by x, y and its id
            var realObj = new THREE.Mesh(obj_geometry, type);
            var coordinates = this.getRealCoordinates(x, z);
            realObj.position.set(coordinates.x, 32, coordinates.z);
            this.objects[id] = {
                index: realObj
            };
            this.scene.add(realObj);
        },
        addReyToWorldWithNoCollisions: function (type, obj_geometry, id, x, z) { // needed to place objects by x, y and its id
            var realObj = new THREE.Mesh(obj_geometry, type);
            var coordinates = this.getRealCoordinates(x, z);
            realObj.position.set(coordinates.x, 32, coordinates.z);
            this.objects[id] = {
                index: realObj
            };
            this.scene.add(realObj);
        },
        deleteObjectFromWorld: function (id) {
            if (this.objects[id]) {
                if (this.objects[id].index.mesh != undefined) {
                    this.scene.remove(this.objects[id].index.mesh);
                } else {
                    this.scene.remove(this.objects[id].index);
                }
                delete this.objects[id];
            } 
        },
        setBomb: function (id, x, z) {
            var self = this;
            var bomb = this.bombObj.clone();
            var coordinates = this.getRealCoordinates(x,z);
            bomb.position.set(coordinates.x, 2, coordinates.z);
            var timerId = setInterval(function () {
                bomb.scale.y *= 1.09;
                bomb.scale.x *= 1.09;
                bomb.scale.z *= 1.09;
            }, 500);
            setTimeout(function () {
                clearInterval(timerId);
                self.scene.remove(bomb);
            }, 2000);
            this.objects[id] = {
                index: bomb
            };
            this.scene.add(bomb);
        }
    };
    
    return objects;

});