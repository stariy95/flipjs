if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Animation = {};

(function(){
    
    console.log("Loaded ANIMATION module");
    
    var Core = $flip.Core;
    
    Animation.inherits(Core.Material);
    
    function Animation(textureName, frames, speed) {
        //Core.Material.apply(this, [textureName]);
        
        this.frames = [];
        this.frameCount = frames;
        this.timePerFrame = 1000 / speed;
        this.time = 0;
        this.currentFrame = 0;
        this.isStoped = false;
        
        var createCallBack = function(material, idx){
                return function(img) {
                    material.frames[idx] = img;
                };
            };
        
        for(var i=0; i<frames; i++) {
            var img = Core.TextureCache.getImage(textureName + "-" + (i + 1) + ".png");
            if(img === null) {
                Core.TextureCache.addElement(textureName + "-" + (i + 1) + ".png", createCallBack(this, i));
            } else {
                this.frames[i] = img;
            }
        }
    }
    
    Animation.prototype.update = function(time) {
        if(this.isStoped) {
            return;
        }
        
        this.time += time;
        if(this.time > this.timePerFrame) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.time = 0;
        }
    };
    
    Animation.prototype.getTexture = function() {
        return this.frames[this.currentFrame];
    };
    
    Animation.prototype.stop = function() {
        this.isStoped = true;
    };
    
    Animation.prototype.resume = function() {
        this.isStoped = false;
        this.time = 0;
    };
    
    Core.Animation = Animation;
    
}());