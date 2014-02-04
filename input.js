
if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Input = {};

(function(){
    
    console.log("Loaded INPUT module");
    
    var Core = $flip.Core;
    
    /**
     * Class InputManager
     * 
     * 
     */
    function InputManager() {
        var canvas = Core.Render.getCanvas();
        this.enabled = true;
        canvas.onclick = function(evt) {
            evt = evt || window.event;
            evt.x = evt.x || evt.clientX;
            evt.y = evt.y || evt.clientY;
            $flip.Input.onclick(evt);
        };
    }
     
    InputManager.prototype.onclick = function(evt) {
        if(!this.enabled) {
            return;
        }
        
        for(var idx in Core.Render.objects) {
            var object = Core.Render.objects[idx];
            if(this.checkObject(object, evt)) {
                if(object.onclick(evt)) {
                    return;
                }
            }
        }
    };
    
    InputManager.prototype.setEnabled = function(enabled) {
        this.enabled = enabled;
    };
    
    InputManager.prototype.checkObject = function(object, evt) {
        if(typeof object.onclick != 'function') {
            return false;
        }
        
        if(( evt.x > object.position.x && evt.x < (object.position.x + object.size.w) ) &&
           ( evt.y > object.position.y && evt.y < (object.position.y + object.size.h) )) {
            return true;
        }
        
        return false;
    };
    
    
    $flip.Input = new InputManager();
}());