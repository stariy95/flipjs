
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
                callbackMaterial.onload(img);
            });
        } else {
            this.texture = img;
        }
    }
    
    Material.prototype.update = function(time) {
        
    };
    
    Material.prototype.getTexture = function() {
        return this.texture;
    };
    
    Material.prototype.onload = function(img) {
        this.texture = img;
        if(typeof this.afterload == 'function') {
            this.afterload();
        }
    };
    
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
     * Simple 2D quad (aka sprite), base rendering unit.
     * If created without material or texture, it will be rendered with lines.
     * 
     * Usage example:
     * 
     * var object = new $flip.Core.RenderObject("img.jpg");
     * object.setSize([100, 100]);
     * object.setPosition([250, 500]); 
     * 
     */ 
    function RenderObject(material) {
        this.id = 0;
        this.position = {x: 0, y: 0};
        this.size = {w: 1, h: 1};
        
        if(material instanceof Core.Material) {
            this.material = material;
        } else if(typeof material == 'string'){
            this.material = new Core.Material(material);
        } else {
            this.material = {};
        }
        
        this.children = [];
        this.actions = [];
        this.skew = [0, 0];
        this.parentObject = null;
        this.touchEnabled = false;
        this.collisionEnabled = false;
        
        Core.Render.addObject(this);
    }
    
    RenderObject.prototype.addChild = function(child) {
          if(!(child instanceof RenderObject)) {
              console.log("RenderObject.addChild(); Try to add not render object as a child.");
              return;
          }
          
          this.children.push(child);
          child.parentObject = this;
    };
    
    RenderObject.prototype.addAction = function(action) {
        action.setTarget(this);
        this.actions.push(action);
    };
    
    RenderObject.prototype.removeAction = function(action) {
        var idx = this.actions.indexOf(action);
        if(idx == -1) {
            return;
        }
        this.actions.splice(idx, 1);
    };
    
    RenderObject.prototype.update = function(time) {
        for(var i in this.actions) {
            this.actions[i].update(time);
        }
        if(this.material) {
            this.material.update(time);
        }
    };
    
    RenderObject.prototype.render = function(context) {
        if(context) {
            context.setTransform(1, this.skew[0], this.skew[1], 1, this.position.x, this.position.y);
            if(this.material.getTexture()) {
                context.drawImage(this.material.getTexture(), 0, 0, this.size.w, this.size.h);
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
    
    RenderObject.prototype.setTouchEnabled = function(enabled) {
        if(enabled == this.touchEnabled) {
            return;
        }
        
        if(typeof $flip.Input == 'undefined') {
            console.log("No input module included");
            return;
        }
        
        this.touchEnabled = enabled;
        if(enabled) {
            $flip.Input.addObject(this);
        } else {
            $flip.Input.removeObject(this);
        }
    };
    
    RenderObject.prototype.setCollisionEnabled = function(enabled) {
        if(enabled == this.collisionEnabled) {
            return;
        }
        
        if(typeof $flip.Physics == 'undefined') {
            console.log("No physics module included");
            return;
        }
        
        this.collisionEnabled = enabled;
        if(enabled) {
            $flip.Physics.addObject(this);
        } else {
            $flip.Physics.removeObject(this);
        }
    };
    
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
        
        var winSize = $flip.Utils.getWindowSize();
        this.canvas.width  = winSize.w;
        this.canvas.height = winSize.h;
        this.canvas.style.margin = '0px';
        
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this.canvas);
        body.style.padding = '0px';
        
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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(var i in this.objects) {
            var object = this.objects[i];
            object.update(deltaTime);
            object.render(this.context);
        }
        
        if(typeof $flip.Physics == 'object') {
            $flip.Physics.update(deltaTime);
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
    };
    
    /**************************************************************************
     *          EXPORT
     **************************************************************************/
    
    Core.Render = new Render();
    Core.TextureCache = new TextureCache('img');
    Core.Material = Material;
    Core.RenderObject = RenderObject;
    
}());
