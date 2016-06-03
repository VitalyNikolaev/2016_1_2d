define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');
    var SPE = require('SPE');
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
				particleCount: 50, // 10^3 is almost an infinite source of particles
				type: SPE.distributions.SPHERE,
				maxAge: {value: 1.25, spread: 1.1},	
				activeMultiplier: 0.2,	// Lower it to ~50 pps
				velocity: {
					value: 50,
					spread: 50,
				},
				size: {value: [120, 40, 0]},
				wiggle: {value: 10},
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