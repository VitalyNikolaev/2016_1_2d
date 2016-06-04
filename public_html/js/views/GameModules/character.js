define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
	var modelLoader = require('utils/modelLoader');
    var jQuery = require('jquery');
    var ws = require('utils/ws');

	var bombermanCounter = 1;
	
    var Character = {
		resetCounter: function() {
			bombermanCounter = 1;
		},
        init: function (color, position, user_id) {
            this.realDirection = {
                x: 0,
                z: 0
            };
            this.mesh = new THREE.Object3D();
            this.mesh.position.y = 48;
			
			if (bombermanCounter == 1) {
            this.head = gameObjects.prefabsObjects['player_body_white'].clone();
			} else if (bombermanCounter == 2) {
            this.head = gameObjects.prefabsObjects['player_body_red'].clone();
			} else if (bombermanCounter == 3) {
            this.head = gameObjects.prefabsObjects['player_body_blue'].clone();
			} else {
            this.head = gameObjects.prefabsObjects['player_body_green'].clone();
			}
			bombermanCounter++;
            this.head.position.y = 0;
            this.mesh.add(this.head);
			
            this.hands = {
                left: gameObjects.prefabsObjects['player_l_hand'].clone(),
                right: gameObjects.prefabsObjects['player_r_hand'].clone()
            };
            this.hands.left.position.x = -32;
            this.hands.left.position.y = -8;
            this.hands.right.position.x = 32;
            this.hands.right.position.y = -8;
            this.mesh.add(this.hands.left);
            this.mesh.add(this.hands.right);
            this.feet = {
                left: gameObjects.prefabsObjects['player_l_foot'].clone(),
                right: gameObjects.prefabsObjects['player_r_foot'].clone()
            };
            this.feet.left.position.x = -20;
            this.feet.left.position.y = -36;
            this.feet.left.rotation.y = Math.PI / 4;
            this.feet.right.position.x = 20;
            this.feet.right.position.y = -36;
            this.feet.right.rotation.y = Math.PI / 4;
            this.mesh.add(this.feet.left);
            this.mesh.add(this.feet.right);
            // this.textMaterial = new THREE.MeshPhongMaterial({
            //     color: 0xdddddd
            // });
            // this.nickname = new THREE.TextGeometry(gameObjects.playerNicks[user_id],{
            //     font:'bangers',
            //     size: 40,
            // });
            // this.nickname.position.y = 57;
            // this.mesh.add(this.nickname);

            var playerCoordinates = gameObjects.getBomberManRealCoordinates(position.x, position.z); // where we need to place our character
            this.mesh.position.set(playerCoordinates.x, 48, playerCoordinates.z);

            this.direction = new THREE.Vector3(0, 0, 0);
            this.step = 0;
            
            this.setDirection = function (controls) {
                var x = controls.left ? 1 : controls.right ? -1 : 0;
                var z = controls.up ? 1 : controls.down ? -1 : 0;
                this.direction.set(x, 0, z);
            };
            this.sendDirectionWS = function () {
                if (this.direction.x != this.realDirection.x || this.direction.z != this.realDirection.z) {
                    this.realDirection.x = this.direction.x;
                    this.realDirection.z = this.direction.z;
                    ws.sendMessage({
                        "type": "object_changed",
                        "x": this.realDirection.x,
                        "y": this.realDirection.z
                    })
                }
            };
            this.rotate = function (x, z) {
                var angle = Math.atan2(x, z);
                var difference = angle - this.mesh.rotation.y;
                if (Math.abs(difference) > Math.PI) {
                    if (difference > 0) {
                        this.mesh.rotation.y += 2 * Math.PI;
                    } else {
                        this.mesh.rotation.y -= 2 * Math.PI;
                    }
                    difference = angle - this.mesh.rotation.y;
                }
                if (difference !== 0) {
                    this.mesh.rotation.y += difference / 4;
                }
            };
            this.getRealSpeed = function() {
                var constSpeed = 2; // tiles per second
                return constSpeed * 64 / gameObjects.fps;
            };
            this.move = function () {
                this.mesh.position.x += this.realDirection.x * ((this.direction.z === 0) ? this.getRealSpeed() : Math.sqrt(this.getRealSpeed()));
                this.mesh.position.z += this.realDirection.z * ((this.direction.x === 0) ? this.getRealSpeed() : Math.sqrt(this.getRealSpeed()));
                this.step += 1 / 4;
                this.feet.left.position.setZ(Math.sin(this.step) * 16);
                this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
                this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
                this.hands.right.position.setZ(Math.sin(this.step) * 8);
            };
            this.setControls = function (position) {
                var controls = {
                    left: false,
                    up: false,
                    right: false,
                    down: false
                };
                function makeControls(status, keyCode, position) {
                    var pressed = status;
                    if (position === 'top') {
                        switch (String.fromCharCode(keyCode)) {
                            case 'A':
                                controls.right = pressed;
                                break;
                            case 'W':
                                controls.down = pressed;
                                break;
                            case 'D':
                                controls.left = pressed;
                                break;
                            case 'S':
                                controls.up = pressed;
                                break;
                        }
                    } else {
                        switch (String.fromCharCode(keyCode)) {
                            case 'A':
                                controls.left = pressed;
                                break;
                            case 'W':
                                controls.up = pressed;
                                break;
                            case 'D':
                                controls.right = pressed;
                                break;
                            case 'S':
                                controls.down = pressed;
                                break;
                        }
                    }
                    gameObjects.playersCharacter.setDirection(controls);
                }
                var gameDiv = jQuery('#game');
                gameDiv.keydown(function (e) {
                    if (String.fromCharCode(e.keyCode ) == ' ') {
                        ws.sendMessage({"type": "bomb_spawned"})
                    }
                    makeControls(true, e.keyCode, position);
                    e.preventDefault();
                });
                gameDiv.keyup(function (e) {
                    makeControls(false, e.keyCode, position);
                    e.preventDefault();
                });
            };
            this.setFocus = function (object, z) {
                gameObjects.camera.position.set(object.position.x, object.position.y + 750, object.position.z - z);
                gameObjects.camera.lookAt(object.position);
            };
        }
    };
    return Character
});