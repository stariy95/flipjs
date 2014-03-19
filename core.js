
if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Utils = {};

(function() {
    
    console.log("Loaded CORE module");
    
    /**************************************************************************
     *          UTILITY FUNCTIONS
     **************************************************************************/
    Function.prototype.inherits = function(parent) {
        this.prototype = Object.create(parent.prototype);
        this.prototype.$super = parent.prototype;
    };
    
    try {
        document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);
    } catch(e) {
        console.log(e);
    }
    
    try {
        document.addEventListener('scroll', function(event) {event.preventDefault();}, false);
    } catch(e) {
        console.log("No scroll event.");
    }
    
    
    /**************************************************************************
     *          CLASSES
     **************************************************************************/
    
    /**
     * Class Utils
     * 
     * Entry point for all logic.
     * 
     * $flip.Utils.require(["render", "actions"], function() {
     *      . . .
     *      Your code goes here
     *      . . .
     * });
     */
    function Utils() {
    }
    
    Utils.prototype.xhr = function(url, callback) {
        
    };
    
    Utils.prototype.load = function(file) {
        
    };
    
    Utils.prototype.getWindowSize = function() {
        var w,h;
        if( window.innerWidth )
        {
            w = window.innerWidth;
            h = window.innerHeight;
        } else {
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }
        
        return {w: w, h: h};
    };
    
    Utils.prototype.require = function(module, callback) {
        var modulesToLoad = [];
        if(Array.isArray(module)) {
            modulesToLoad = module;
        } else {
            modulesToLoad.push(module);
        }
        
        var modulesCount = modulesToLoad.length;
        var onScriptLoad = function(event){
            if (event.type === 'load') {
                modulesCount--;
                if(modulesCount === 0) {
                    callback();
                }
            }
        };
        
        for(var idx in modulesToLoad) {
            var script_block = document.createElement('script');
            script_block.type = 'text/javascript';
            
            if(script_block.attachEvent) {
                script_block.attachEvent('onreadystatechange', onScriptLoad);
            } else {
                script_block.addEventListener('load', onScriptLoad, false);
            }
            
            script_block.src = modulesToLoad[idx] + '.js';
            script_block.appendChild(document.createTextNode(""));
            document.getElementsByTagName("head")[0].appendChild(script_block);
        }
    };
    
    Utils.prototype.supportsTouch = ('ontouchstart' in document.documentElement);
    
    /**************************************************************************
     *          EXPORT
     **************************************************************************/
    $flip.Utils = new Utils();
}());