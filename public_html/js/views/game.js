define(function (require) {
    var gameInit = require('views/GameModules/gameInit');
    var baseView = require('views/baseView');
    var tmpl = require('tmpl/game');
    var app = require('app');
    var gameObjects = require('views/GameModules/gameObjects');
    var THREE = require('three');
    var Character = require('views/GameModules/character');
    var ws = require('utils/ws');

    var View = baseView.extend({
        template: tmpl,
        pingTimer: null,
        requireAuth: true,
        gameStartedId: null,
        initialize: function () {
            this.render();
            gameInit.init();
            this.listenTo(app.wsEvents, "object_spawned", this.addObject);
            this.listenTo(app.wsEvents, "bomberman_spawned", this.spawnBomberman);
            this.listenTo(app.wsEvents, "object_destroyed", this.destroyObject);
            this.listenTo(app.wsEvents, "game_over", this.gameOver);
            this.listenTo(app.wsEvents, "object_changed", this.moveBomberman);
        },
        show: function () {
            baseView.prototype.show.call(this);
            this.startGame();
            this.pingTimer = setInterval(function () {
                ws.sendPing()
            }, 10000);
        },
        hide: function () {
            baseView.prototype.hide.call(this);
            this.endGame();
        },
        startGame: function () {
            var self = this;
            var lastLoop = new Date;
            gameInit.addToDOM();
            function animate() {
                self.gameStartedId = requestAnimationFrame(animate);
                var thisLoop = new Date;
                gameObjects.fps = 1000 / (thisLoop - lastLoop);
                lastLoop = thisLoop;
                gameInit.frame();
            }
            animate();  
        },
        endGame: function () {
            if (this.gameStartedId != null) {
                if(ws.socket.readyState != 3) {
                    ws.closeConnection();
                    clearInterval(this.pingTimer);
                }
                cancelAnimationFrame(this.gameStartedId);
                this.gameStartedId = null;
                gameInit.dealloc();
                $('canvas').remove();
                app.gameReady = false;
                app.user.set('contentLoaded', false);
                gameInit.init();
            }
        },
        gameOver: function () {
            window.location.href = '#main';
        },
        spawnBomberman: function (data) {
            if (data.user_id === app.user.get('id')) {
                gameObjects.playersCharacter = new Character.init({
                        color: Math.random() * 0xffffff}, {x: data.x, z: data.y});
                gameObjects.playersCharacter.name = data.id;
                gameObjects.objects[data.id] =  {
                  index: gameObjects.playersCharacter.mesh
                };
                gameObjects.scene.add(gameObjects.objects[data.id].index);
                if ( data.y > 15 ) {
                    gameObjects.playersCharacter.setControls('top');
                } else {
                    gameObjects.playersCharacter.setControls('bot');
                }
            } else {
                gameObjects.objects[data.id] = {
                   index: new Character.init({
                        color: Math.random() * 0xffffff}, 
                       {x: data.x, z: data.y}).mesh
                    };

                gameObjects.scene.add(gameObjects.objects[data.id].index);
            }

        },
        addObject: function (data) {
            if (data.object_type === 'destructible_wall') {
                gameObjects.addObjectToWorld(gameObjects.worldObjects.destructible_crate, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'undestructible_wall') {
                gameObjects.addObjectToWorld(gameObjects.worldObjects.indestructible_crate, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_increase_bomb_range') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_decrease_bomb_spawn_delay') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_increase_speed') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_decrease_bomb_spawn_delay') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_increase_max_hp') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bonus_decrease_bomb_explosion_delay') {
                gameObjects.addObjectToWorldWithNoCollisions(gameObjects.worldObjects.bomb_bonus_range, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bomb_ray') {
                gameObjects.addReyToWorldWithNoCollisions(gameObjects.worldObjects.explosion_rey, new THREE.CubeGeometry(64, 64, 64), data.id, data.x, data.y);
                return
            }
            if (data.object_type === 'bomb') {
                gameObjects.setBomb(data.id, data.x, data.y);
                return
            }

        },
        destroyObject: function (data) {
            gameObjects.deleteObjectFromWorld(data.id);
        },
        moveBomberman: function (data) {
            var coordinates = gameObjects.getBomberManRealCoordinates(data.x, data.y);
            gameObjects.objects[data.id].index.position.set(coordinates.x, 48, coordinates.z);
        }
        
    });
    return new View();

});
