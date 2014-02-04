
if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Core = {};

(function(){
    
    console.log("Loaded RENDER module");
    
    // aliases
    var Core = $flip.Core;
    
    /**************************************************************************
     *          UTILITY FUNCTIONS
     **************************************************************************/
    var requestAnimFrame = window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    
    /**************************************************************************
     *          CLASSES
     **************************************************************************/
    
    /**
     * Class Material
     */ 
    function Material(textureName) {
        this.id = 0;
        this.texture = null;
        this.shader = null;
        this.color = [0, 0, 0, 1];
        var img = Core.TextureCache.getImage(textureName);
        if(img === null) {
            var callbackMaterial = this;
            Core.TextureCache.addElement(textureName, function(img) {
                callbackMaterial.texture = img;
            });
        } else {
            this.texture = img;
        }
    }
    
    /**
     * Class TextureCache
     */ 
    function TextureCache(basepath) {
        this.cache = [];
        this.basepath = basepath;
    }
    
    TextureCache.prototype.getImage = function(name) {
        for(var id in this.cache) {
            if(this.cache[id].name == name) {
                return this.cache[id].img;
            }
        }
        
        return null;
    };
    
    TextureCache.prototype.addElement = function(name, callback) {
        var img = new Image();
        var id = Core.TextureCache.cache.push({name: name, img: img, ready: false}) - 1;
        img.onload = function() {
            Core.TextureCache.cache[id].ready = true;
            callback(img);
        };
        img.src = this.basepath + "/" + name;
    };
    
    
    /**
     * Class RenderObject
     * 
     * Simple 2D quad (aka sprite), base render unit.
     * If created without material, it will be rendered with lines.
     * 
     * Usage example:
     * 
     * var material = new $flip.Core.Material("img.jpg");
     * var object = new $flip.Core.RenderObject(material);
     * object.setSize([100, 100]);
     * object.setPosition([250, 500]); 
     * 
     */ 
    function RenderObject(material) {
        this.id = 0;
        this.position = {x: 0, y: 0};
        this.size = {w: 1, h: 1};
        this.material = material;
        this.children = [];
        this.actions = [];
        this.skew = [0, 0];
        Core.Render.addObject(this);
    }
    
    RenderObject.prototype.addChild = function(child) {
          if(!(child instanceof RenderObject)) {
              console.log("RenderObject.addChild(); Try to add not render object as a child.");
              return;
          }
          
          this.children.push(child);
    };
    
    RenderObject.prototype.addAction = function(action) {
        action.setTarget(this);
        this.actions.push(action);
    };
    
    RenderObject.prototype.removeAction = function(action) {
        var idx = this.actions.indexOf(action);
        this.actions.splice(idx, 1);
    };
    
    RenderObject.prototype.update = function(time) {
        for(var i in this.actions) {
            this.actions[i].update(time);
        }
    };
    
    RenderObject.prototype.render = function(context) {
        if(context) {
            context.setTransform(1, this.skew[0], this.skew[1], 1, this.position.x, this.position.y);
            if(this.material.texture) {
                context.drawImage(this.material.texture, 0, 0, this.size.w, this.size.h);
            } else {
                context.rect(0, 0, this.size.w, this.size.h);
                context.stroke();
            }
            context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            console.log("No drawing context");
        }
    };
    
    RenderObject.prototype.deltaPosition = function(position) {
        if(Array.isArray(position)) {
            this.position.x += position[0];
            this.position.y += position[1];
        } else {
            console.log("RenderObject.setPosition(); Wrong position parameter");
        }
        
        for(var i in this.children) {
            this.children[i].deltaPosition(position);
        }
    };
    
    RenderObject.prototype.setPosition = function(position) {
        var delta = [0, 0];
        if(Array.isArray(position)) {
            delta[0] = position[0] - this.position.x;
            delta[1] = position[1] - this.position.y;
        } else if(typeof position === 'object') {
            delta[0] = position.x - this.position.x;
            delta[1] = position.y - this.position.y;
        } else {
            console.log("RenderObject.setPosition(); Wrong position parameter");
        }
        
        this.deltaPosition(delta);
    };
    
    RenderObject.prototype.setScale = function(scale) {
        if(typeof scale === 'object') {
            this.size.w *= scale.x;
            this.size.h *= scale.y;
        } else if(typeof scale === 'number') {
            this.size.w *= scale;
            this.size.h *= scale;
        } else {
            console.log("RenderObject.setScale(); Wrong scale parameter");
        }
        
        for(var i in this.children) {
            this.children[i].setScale(scale);
        }
    };
    
    RenderObject.prototype.setSize = RenderObject.prototype.setScale;
    
    /**
     * Class Render
     * 
     * To start rendering loop call:
     * 
     * $flip.Core.Render.start();
     */ 
    function Render() {
        this.objects = [];
        this.materials = [];
        this.canvas = document.createElement('canvas');
        this.canvas.id     = "main_canvas";
        this.canvas.width  = 1264;
        this.canvas.height = 640;
        document.getElementsByTagName("body")[0].appendChild(this.canvas);
        
        this.context = this.canvas.getContext('2d');
    }
    
    Render.prototype.addObject = function(object) {
        this.objects.push(object);
    };
    
    Render.prototype.start = function() {
        this.startTime = 0;
        this.update(0);
    };
    
    Render.prototype.update = function(deltaTime) {
        this.context.clearRect(0, 0, 1264, 640);
        
        for(var i in this.objects) {
            this.objects[i].update(deltaTime);
            this.objects[i].render(this.context);
        }
        
        requestAnimFrame(function(time) {
            var delta;
            if(Core.Render.startTime === 0) {
                delta = 0;
            } else {
                delta = time - Core.Render.startTime;
            }
            Core.Render.startTime = time;
            Core.Render.update(delta);
        }, this.canvas);
    };
    
    Render.prototype.getCanvas = function() {
        return this.canvas;
    }
    
    /**************************************************************************
     *          EXPORT
     **************************************************************************/
    
    Core.Render = new Render();
    Core.TextureCache = new TextureCache('img');
    Core.Material = Material;
    Core.RenderObject = RenderObject;
    
}());
