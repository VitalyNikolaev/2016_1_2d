define(function (require) {
    var THREE = require('three');
    var jQuery = require('jquery');

    var objects = {
        scene: null,
        camera: null,
        light: null,
        renderer: null,
        playersCharacter: null,
        fps: 0,
        objects: {}, // here we dump all links to obstacle index by id of object
        obstacles: [], // here we dump all our obstacles for raycaster
        bombObj: null,
        worldObjects: {
            indestructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/grey_bricks2.jpg')}),
            destructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/destruct_crate.gif')}),
            bomb_bonus_range: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/bonus_bomb.gif')}),
            explosion_rey: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/explosion.jpg')}),
        },
        getRandomColor: function () {
            return Math.random() * 255;
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
        getGameCoordinates: function (x, z) {
            return {
                x: (x + 992) / 64,
                z: (z + 992) / 64
            }
        },
        addObjectToWorld: function (type, obj_geometry, id, x, z) { // needed to place objects by x, y and its id
            var realObj = new THREE.Mesh(obj_geometry, type);
            var coordinates = this.getRealCoordinates(x, z);
            realObj.position.set(coordinates.x, 32, coordinates.z);
            this.obstacles.push(realObj);
            this.objects[id] = {
                index: this.obstacles.indexOf(realObj)
            };
            this.scene.add(realObj);
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
        addBombToWorld: function (object, id, x, z) {
            var coordinates = this.getBomberManRealCoordinates(x, z);
            object.position.set(coordinates.x, 2, coordinates.z);
            this.obstacles.push(object);
            this.objects[id] = {
                index: this.obstacles.indexOf(object)
            };
            this.scene.add(object);
        },
        addPlayerToWorld: function (id, object) { // add all players besides yours to colide
            this.obstacles.push(object);
            this.objects[id] = {
                index: this.obstacles.indexOf(object)
            };
        },
        deleteObjectFromWorld: function (id) {
            if (this.objects[id]) {
                if (this.obstacles[this.objects[id].index]) {
                        this.scene.remove(this.obstacles[this.objects[id].index]);
                        this.obstacles.splice(this.objects[id].index, 1);
                        delete this.objects[id];
                } else {
                    this.scene.remove(this.objects[id]);
                    delete this.objects[id];
                }
            } 
        },
        setBomb: function (id, x, z) {
            var self = this;
            var bomb = this.bombObj.clone();
            var coordinates = this.getRealCoordinates(x,z);
            bomb.position.set(coordinates.x, 2, coordinates.z);
            var timerId = setInterval(function () {
                bomb.scale.y *= 1.25;
                bomb.scale.x *= 1.25;
                bomb.scale.z *= 1.25;
            }, 1000);
            setTimeout(function () {
                clearInterval(timerId);
                self.scene.remove(bomb);
            }, 3000);
            this.scene.add(bomb);
        }
};
    
    return objects;

});