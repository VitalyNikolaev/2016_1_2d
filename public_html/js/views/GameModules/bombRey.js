define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
	var globalScale = require('utils/globalScale');
	
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
                scale: 600,
                maxParticleCount: 400,
            });
            this.shockwaveGroup = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.shockwaveGroup,
                },
                depthTest: false,
                depthWrite: true,
                blending: THREE.NormalBlending,
                maxParticleCount: 150,
            });

            this.fireball = new SPE.Emitter({
                particleCount: 40,
                type: SPE.distributions.SPHERE,
                position: {
                    radius: 1 * globalScale
                },
                maxAge: {value: 1.1},
                duration: 1,
                activeMultiplier: 15,
                velocity: {
                    value: new THREE.Vector3(50 * globalScale)
                },
                size: {value: [40 * globalScale, 150 * globalScale]},
                color: {
                    value: [
                        new THREE.Color(0.5, 0.1, 0.05),
                        new THREE.Color(0.2, 0.2, 0.2)
                    ]
                },
                opacity: {value: [0.5, 0.35, 0.1, 0]}
            }),
                this.mist = new SPE.Emitter({
                    particleCount: 90,
                    position: {
						radius: 10 * globalScale,
                        spread: new THREE.Vector3(10, 10, 10),
                        distribution: SPE.distributions.SPHERE
                    },
                    maxAge: {value: 2},
                    duration: 1,
                    activeMultiplier: 1000,
                    velocity: {
                        value: new THREE.Vector3(8 * globalScale, 3 * globalScale, 10 * globalScale),
                        distribution: SPE.distributions.SPHERE
                    },
                    size: {value: 40 * globalScale},
                    color: {
                        value: new THREE.Color(0.2, 0.2, 0.2)
                    },
                    opacity: {value: [0, 0, 0.2, 0]}
                }),
            this.group.addEmitter(this.fireball);
            this.shockwaveGroup.addEmitter(this.mist);
        },

    };
    return bombRey

});