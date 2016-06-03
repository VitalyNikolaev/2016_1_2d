define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
    var bombRey = {
        init: function () {
            this.particleGroup = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.cloud
                },
                blending: THREE.NormalBlending,
                fog: true,
                maxParticleCount: 400,
            });

            this.emitter = new SPE.Emitter({
                particleCount: Math.floor(Math.random() * 200),
                maxAge: {
                    value: 3,
                },
                position: {
                    value: new THREE.Vector3( 0, -15, -50 ),
                    spread: new THREE.Vector3( 100, 30, 100 )
                },
                velocity: {
                    value: new THREE.Vector3( 0, 0, 30 ),
                    randomise: true
                },
                wiggle: {
                    spread: 40
                },
                size: {
                    value: Math.floor(Math.random() * 120),
                    spread: Math.floor(Math.random() * 700),
                },
                opacity: {
                    value: [ 0, 1, 0 ]
                },
                color: {
                    value: new THREE.Color( 1, 1, 1 ),
                    spread: new THREE.Color( 0.1, 0.1, 0.1 )
                },
                angle: {
                    value: [ 0, Math.PI * 0.125 ]
                }
            });

            this.particleGroup.addEmitter(this.emitter);
            this.angle  = 0;
        }

    };
    return bombRey

});