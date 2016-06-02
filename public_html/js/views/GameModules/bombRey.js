define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
    var bombRey = {
        init: function () {
            this.group = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.fireball,
                    frames: new THREE.Vector2(5, 5),
                    loop: 1
                },
                depthTest: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                scale: 600
            });
            this.shockwaveGroup = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.shockwaveGroup,
                },
                depthTest: false,
                depthWrite: true,
                blending: THREE.NormalBlending,
            });
            this.shockwave = new SPE.Emitter({
                particleCount: Math.random() * (200 - 50) + 50,
                type: SPE.distributions.DISC,
                position: {
                    radius: 5,
                    spread: new THREE.Vector3( 20 )
                },
                maxAge: {
                    value: 2,
                    spread: 0
                },
                duration: 1,
                activeMultiplier: 2000,

                velocity: {
                    value: new THREE.Vector3( 70 )
                },
                rotation: {
                    axis: new THREE.Vector3( 1, 0, 0 ),
                    angle: Math.PI * 0.5,
                    static: true
                },
                size: { value: 2 },
                color: {
                    value: [
                        new THREE.Color( 0.4, 0.2, 0.1 ),
                        new THREE.Color( 0.2, 0.2, 0.2 )
                    ]
                },
                opacity: { value: [0.5, 0.2, 0] }
            }),
                this.debris = new SPE.Emitter({
                    particleCount: 100,
                    type: SPE.distributions.SPHERE,
                    position: {
                        radius: 0.1,
                    },
                    maxAge: {
                        value: 2
                    },
                    duration: 2,
                    activeMultiplier: 40,

                    velocity: {
                        value: new THREE.Vector3(100)
                    },
                    acceleration: {
                        value: new THREE.Vector3(0, -20, 0),
                        distribution: SPE.distributions.BOX
                    },
                    size: {value: 2},
                    drag: {
                        value: 1
                    },
                    color: {
                        value: [
                            new THREE.Color(1, 1, 1),
                            new THREE.Color(1, 1, 0),
                            new THREE.Color(1, 0, 0),
                            new THREE.Color(0.4, 0.2, 0.1)
                        ]
                    },
                    opacity: {value: [0.4, 0]}
                }),
                this.fireball = new SPE.Emitter({
                    particleCount: 170,
                    type: SPE.distributions.SPHERE,
                    position: {
                        radius: 1
                    },
                    maxAge: {value: 1.1},
                    duration: 1,
                    activeMultiplier: 20,
                    velocity: {
                        value: new THREE.Vector3(Math.random() * (100 - 50) + 50)
                    },
                    size: {value: [40, 150]},
                    color: {
                        value: [
                            new THREE.Color(0.5, 0.1, 0.05),
                            new THREE.Color(0.2, 0.2, 0.2)
                        ]
                    },
                    opacity: {value: [0.5, 0.35, 0.1, 0]}
                }),
                this.mist = new SPE.Emitter({
                    particleCount: 50,
                    position: {
                        spread: new THREE.Vector3(10, 10, 10),
                        distribution: SPE.distributions.SPHERE
                    },
                    maxAge: {value: 2},
                    // duration: 1,
                    activeMultiplier: 2000,
                    velocity: {
                        value: new THREE.Vector3(8, 3, 10),
                        distribution: SPE.distributions.SPHERE
                    },
                    size: {value: 40},
                    color: {
                        value: new THREE.Color(0.2, 0.2, 0.2)
                    },
                    opacity: {value: [0, 0, 0.2, 0]}
                }),

            this.group.addEmitter(this.fireball);
            this.shockwaveGroup.addEmitter(this.debris).addEmitter(this.mist);
        }

    };
    return bombRey

});