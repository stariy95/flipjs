
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
        this.defaultAction = null;
        this.objects = [];
        this.keyListeners = {};
        
        var clickCallback = function(evt) {
            evt = evt || window.event;
            var event = {};
            
            if(evt.targetTouches) {
                var touch = evt.targetTouches[0];
                event.x = touch.x || touch.clientX;
                event.y = touch.y || touch.clientY;
            } else {
                event.x = evt.x || evt.clientX;
                event.y = evt.y || evt.clientY;
            }
            $flip.Input.onclick(event);
        };
        
        if($flip.Utils.supportsTouch) {
            canvas.addEventListener('touchstart', clickCallback, false);
        } else {
            canvas.onclick = clickCallback;
        }
        
        canvas.onkeydown = function(evt){
            $flip.Input.onkey(evt);
        };
    }
    
    
    InputManager.prototype.onkey = function(evt) {
        var keyCode = evt.keyCode | evt.which;
        
        if(typeof this.keyListeners[keyCode] == 'function') {
            this.keyListeners[keyCode].call(null);
        }
    };
    
    InputManager.prototype.addOnKeyListener = function(keyCode, callback) {
        this.keyListeners.keyCode = callback;
    };
     
    InputManager.prototype.onclick = function(evt) {
        if(!this.enabled) {
            return;
        }
        
        for(var idx in this.objects) {
            var object = this.objects[idx];
            if(this.checkObject(object, evt)) {
                if(object.onclick(evt)) {
                    return;
                }
            }
        }
        
        if(typeof this.defaultAction == 'function') {
            this.defaultAction(evt);
        }
    };
    
    InputManager.prototype.setEnabled = function(enabled) {
        this.enabled = enabled;
    };
    
    InputManager.prototype.addObject = function(object) {
        if(!object.touchEnabled) {
            console.log("Try to add unsupported object to touch manager");
            return;
        }
        
        if(typeof object.onclick != 'function') {
            console.log("Try to add unsupported object to touch manager");
            return false;
        }
        
        this.objects.push(object);
    };
    
    InputManager.prototype.removeObject = function(object) {
        var idx = this.objects.indexOf(object);
        if(idx == -1) {
            return;
        }
        this.objects.splice(idx, 1);
    };
    
    InputManager.prototype.checkObject = function(object, evt) {
        if(( evt.x > object.position.x && evt.x < (object.position.x + object.size.w) ) &&
           ( evt.y > object.position.y && evt.y < (object.position.y + object.size.h) )) {
            return true;
        }
        
        return false;
    };
    
    InputManager.prototype.setDefaultAction = function(action) {
        this.defaultAction = action;
    };
    
    $flip.Input = new InputManager();
}());