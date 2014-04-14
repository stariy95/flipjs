$flip.Utils.require("render", function() {
$flip.Utils.require(["actions", "input", "animation", "physics"], function() {
    
    var Core = $flip.Core;
    var Actions = $flip.Actions;
    var Input = $flip.Input;
    
    var game = {
            
            scene: null,
            
            aliens: null,
            
            player: null,
            
            init: function() {
                this.scene = new Core.RenderObject();
                this.initPlayer();
                this.initAliens();
                
                var height = Core.Render.getCanvas().height;
                Input.setDefaultAction(function(evt) {
                    if(evt.y < (height * 0.75)) {
                        game.playerShot();
                    } else {
                        game.playerMove(evt); 
                    }
                });
                
                Input.addOnKeyListener(32, game.playerShot);
                // Input.addOnKeyListener(35, game.playerShot);
            },
            
            initPlayer: function() {
                this.player = new Core.RenderObject('player.png');
                this.player.setSize({x: 50, y: 25});
                this.player.lives = 5;
                
                var width = Core.Render.getCanvas().width;
                var height = Core.Render.getCanvas().height;
                this.player.setPosition({x: width / 2 - 50 / 2, y: height - 2 * 25});

                this.player.oncollide = function(shot) {
                    if(!shot.isAlien)
                        return;
                        
                    if(--this.player.lives <= 0) {
                        alert("Game Over");
                    }
                };
                this.player.setCollisionEnabled(true);
            },
            
            initAliens: function() {
                this.aliens = new Core.RenderObject();
                
                var alienObj;
                var y = 100;
                var x = 100;
                
                function alientObjCollide(shot) {}
                
                for(var i=0; i<40; i++) {
                    if(i > 0 && i % 10 === 0) {
                        x = 100;
                        y += 35;
                    }
                    alienObj = new Core.RenderObject('alien_01.png');
                    alienObj.setSize({x: 50, y: 25});
                    alienObj.setPosition({x: x, y: y});
                    alienObj.health = 100;
                    alienObj.oncollide = alientObjCollide;
                    alienObj.setCollisionEnabled(true);
                    
                    this.aliens.addChild(alienObj);
                    x += 60;
                }
                
                this.delta = 75;
                this.aliensMove();
            },
            
            aliensMove: function() {
                var width = Core.Render.getCanvas().width;
                if(game.aliens.position.x > width - 10 * 60 - 210 || game. aliens.position.x < 0) {
                    console.log(game.aliens.position.x);
                    game.delta = -game.delta;
                }
                
                var moveAction = new Actions.MoveBy([game.delta, 0], 0.6, Actions.Easing.linear);
                var stopAction = new Actions.Empty(0.5);
                var nextMove = new Actions.CallFunction(game.aliensMove);
                
                game.aliens.actions = [];
                game.aliens.addAction(new Actions.Sequence([moveAction, stopAction, nextMove]));
            },
            
            
            playerShot: function() {
                var shot = new Core.RenderObject('shot.png');
                shot.setSize({x: 10, y: 25});
                shot.setPosition({x: this.player.position.x + 25, y: this.player.position.y - 25});
                shot.addAction(new Actions.MoveTo([this.player.position.x + 25, -25], 6.0, Actions.Easing.linear));
                shot.isPlayer = true;
                shot.oncollide = function(obj) {
                    if(obj.isPlayer) {
                        return;
                    }
                    
                    obj.setCollisionEnabled(false);
                    shot.setCollisionEnabled(false);
                    
                    Core.Render.removeObject(obj);
                    Core.Render.removeObject(shot);
                    
                    game.aliens.removeChild(obj);
                    if(game.aliens.children.length === 0) {
                        alert('Victory!');
                    }
                };
                
                shot.setCollisionEnabled(true);
            },
            
            playerMove: function(evt) {
                var width = Core.Render.getCanvas().width;
                var delta = evt.x < game.player.position.x ? -width/20 : width/20;
                // if(this.player.actions.length === 0) {
                this.player.actions = [];
                this.player.addAction(new Actions.MoveBy([delta, 0], 0.1, Actions.Easing.easeInOutCubic));
                // }
            }
        };
        
    game.init();
    
    Core.Render.start(); 
    
});});


