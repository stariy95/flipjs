<h3>This code is for my personal tests. Feel free to reuse it.</h3>


Sample code:

<code>
    $flip.Utils.require("render", function() {
        $flip.Utils.require(["actions", "input"], function() {
            var Core = $flip.Core;
            var Actions = $flip.Actions;
            var Input = $flip.Input;
            
            Core.Render.start(); 
            
            var animation = new Core.Animation("flying-pinguin", 2, 10);
            var pinguin = new Core.RenderObject(animation);
            pinguin.setPosition([200, height - 50]);
            pinguin.setSize(50);
            
            var pinguinFly = function(evt) {
                if(pinguin.actions.length > 0) {
                    pinguin.actions = [];
                }
                
                var action1 = new Actions.MoveBy([0, -60], 0.2, Actions.Easing.easeOutQuad);
                var action2 = new Actions.MoveTo([200, height - 50], 1.0, Actions.Easing.easeOutBounce);
                var action  = new Actions.Sequence([action1, action2]);
                
                pinguin.addAction(action);
            };
            
            pinguin.oncollide = function(obj) {
                pinguin.setCollisionEnabled(false);
                alert("GAME OVER");
            };
            pinguin.setCollisionEnabled(true);
            
            Input.setDefaultAction(pinguinFly);
        }
    }
</code>