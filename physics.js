if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Physics = {};

(function(){
    
    console.log("Loaded PHYSICS module");
    
    function PhysicsManager() {
        this.objects = [];
        this.time = 0;
        this.updateInterval = 1000 / 20; // default phisics update rate - 20 updates per second
    }
    
    PhysicsManager.prototype.update = function(time) {
        this.time += time;
        if(this.time < this.updateInterval) {
            return;
        }
        
        this.time -= this.updateInterval;
        
        var length = this.objects.length;
        if(length < 2) {
            return;
        }
        
        for(var idx = 0; idx < length - 1; idx++) {
            var object1 = this.objects[idx];
            
            for(var i = idx + 1; i < length; i++) {
                var object2 = this.objects[i];
                
                if(this.checkCollision(object1, object2)) {
                    object1.oncollide(object2);
                    object2.oncollide(object1);
                }
            }
        }
    };
    
    PhysicsManager.prototype.checkCollision = function(o1, o2) {
        return !(o2.position.x             > o1.position.x + o1.size.w || 
                 o2.position.x + o2.size.w < o1.position.x || 
                 o2.position.y + o2.size.h < o1.position.y ||
                 o2.position.y             > o1.position.y + o1.size.h );
    };
    
    PhysicsManager.prototype.addObject = function(object) {
        if(!object.collisionEnabled) {
            console.log("Try to add unsupported object to phisics manager");
            return;
        }
        
        if(typeof object.oncollide != 'function') {
            console.log("Try to add unsupported object to phisics manager");
            return false;
        }
        
        this.objects.push(object);
        console.log("Add object for collision detection");
    };
    
    PhysicsManager.prototype.removeObject = function(object) {
        var idx = this.objects.indexOf(object);
        if(idx == -1) {
            return;
        }
        this.objects.splice(idx, 1);
    };
    
    
    PhysicsManager.prototype.setUpdateRate = function(rate) {
        if(rate < 1 || rate > 60) {
            console.log("Tring to set invalid phisics update rate " + rate + ". It should be in interval [1 - 60] updates per second.");
            return;
        }
        this.updateInterval = 1000 / rate;
    };   
    
    $flip.Physics = new PhysicsManager();
    
}());