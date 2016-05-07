define(function (require) {
    var THREE = require('three');
    var jQuery = require('jquery');
    
    
    var objects = {
        scene: null,
        camera: null,
        light: null,
        renderer: null,
        firstCharacter: null,
        secondCharacter: null,
        objects: {}, // here we dump all links to obstacle index by id of object
        obstacles: [], // here we dump all our obstacles for raycaster
        bombObj: null,
        getRealCoordinates: function (x, z) {
            return {
                x: x * 64 - 992,
                z: z * 64 - 992
            }
        },
        getGameCoordinates: function (x, z) {
            return {
                x: (x + 992) / 64 ,
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
        addBombToWorld: function (object, id, x, z) {
            var coordinates = this.getRealCoordinates(x, z);
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
                this.scene.remove(this.obstacles[this.objects[id].index]);
                this.obstacles.splice(this.objects[id].index, 1);
                delete this.objects[id];
            }
        },
        setBomb: function (id) {
            var bomb = this.bombObj.clone();
            bomb.position.set(this.firstCharacter.mesh.position.x, 2, this.firstCharacter.mesh.position.z);
            var timerId = setInterval(function () {
                bomb.scale.y *= 1.2;
                bomb.scale.x *= 1.2;
                bomb.scale.z *= 1.2;
            }, 1000);
            setTimeout(function () {
                clearInterval(timerId);
            }, 3000);
            this.scene.add(bomb);
        }
};
    
    return objects;

});