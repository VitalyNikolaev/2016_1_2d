define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
	var globalScale = require('utils/globalScale');
	
    var bonusParticles = {
        init: function () {
            this.group = new SPE.Group({
                texture: {
                    value: gameObjects.worldObjects.shockwaveGroup,
                    loop: Infinity
                },
                depthTest: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                scale: 400,
                maxParticleCount: 200,
            });
			this.fireball = new SPE.Emitter({
				particleCount: 80, // 10^3 is almost an infinite source of particles
				type: SPE.distributions.SPHERE,
				maxAge: {value: 1.25, spread: 1.1},	
				activeMultiplier: 0.5,	// Lower it to ~50 pps
				velocity: {
					value: 50 * globalScale,
					spread: 50 * globalScale,
				},
				position: {
                    radius: 10 * globalScale
                },
				size: {value: [120 * globalScale, 40 * globalScale, 0]},
				wiggle: {value: 10 * globalScale},
				color: {
					value: [
						new THREE.Color(246 / 256, 235 / 256, 19 / 256),
						new THREE.Color(116 / 256, 111 / 256, 0)
					]
				},
				opacity: {value: [0.5, 0.35, 0.1, 0]}
			});

            this.group.addEmitter(this.fireball);
        }

    };
    return bonusParticles

});