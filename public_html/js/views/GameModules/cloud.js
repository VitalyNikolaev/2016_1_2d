define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
	var globalScale = require('utils/globalScale');
	
    var bombRey = {
        init: function () {
            this.particleGroup = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.cloud
                },
                blending: THREE.NormalBlending,
                fog: true,
                maxParticleCount: 200,
            });

            this.emitter = new SPE.Emitter({
                particleCount: 200,
                maxAge: {
                    value: 3,
                },
                position: {
                    value: new THREE.Vector3( 0, -15 * globalScale, -50 * globalScale),
                    spread: new THREE.Vector3( 100 * globalScale, 30 * globalScale, 100 * globalScale )
                },
                velocity: {
                    value: new THREE.Vector3( 0, 0, 50 * globalScale ),
                },
                wiggle: {
                    spread: 40 * globalScale
                },
                size: {
                    value: 100 * globalScale,
                    spread: 400 * globalScale,
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
            this.randInt = 0;
        }

    };
    return bombRey

});