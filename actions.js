    
if(typeof $flip == 'undefined') {
    var $flip = window.$flip = {};
}

// exported module
$flip.Actions = {};

(function(){
    
    console.log("Loaded ACTIONS module");
    
    // aliases
    var Core = $flip.Core;
    var Actions = $flip.Actions;
    
    /**************************************************************************
     *          CLASSES
     **************************************************************************/
     
    /**
     * Class BaseAction
     */
    function BaseAction(duration, easeFunction) {
        this.duration = duration * 1000;
        this.time = 0;
        this.target = null;
        
        if(easeFunction) {
            this.easeFunction = easeFunction;
        } else {
            this.easeFunction = Easing.easeInOutElastic;
        }
    }
    
    BaseAction.prototype.setTarget = function(target) {
        if(!(target instanceof Core.RenderObject)) {
            console.log("Action.setTarget(); Try to run action not on RenderObject!");
            return;
        }
        this.target = target;
    };
    
    BaseAction.prototype.update = function(time) {
        this.time += time;
        if(this.time >= this.duration) {
            this.target.removeAction(this);
        }
    };
    
    /**
     * Class ActionMoveTo inherits BaseAction
     * 
     * Usage example:
     * 
     * var action = new $flip.Actions.MoveTo([100, 200], 2.0, $flip.Actions.Easing.easeInOutElastic);
     * object.addAction(action);
     * 
     */
    ActionMoveTo.inherits(BaseAction);
    
    function ActionMoveTo(position, duration, easeFunction) {
        BaseAction.apply(this, [duration, easeFunction]);
        
        this.position = position;
        this.delta = [0, 0];
    }
    
    ActionMoveTo.prototype.setTarget = function(target) {
        this.$super.setTarget.call(this, target);
        
        this.startPosition = [target.position.x, target.position.y];
        this.delta[0] = (this.position[0] - target.position.x);
        this.delta[1] = (this.position[1] - target.position.y);
    };
    
    ActionMoveTo.prototype.update = function(time) {
        this.$super.update.call(this, time);
        
        var x, y;
        if(this.delta[0] !== 0) {
            x = this.easeFunction(this.time, this.startPosition[0], this.delta[0], this.duration);
        } else {
            x = this.startPosition[0];
        }
        if(this.delta[1] !== 0) {
            y = this.easeFunction(this.time, this.startPosition[1], this.delta[1], this.duration);
        } else {
            y = this.startPosition[1];
        }
        this.target.setPosition([x, y]);
    };
    
    /**
     * Class ActionSkewTo inherits BaseAction
     * 
     * Usage example:
     * 
     * var action = new $flip.Actions.SkewTo([0.5, -1], 0.5, $flip.Actions.Easing.easeInOutQuad);
     * object.addAction(action);
     * 
     */
    ActionSkewTo.inherits(BaseAction); 
     
    function ActionSkewTo(skew, duration, easeFunction) {
        BaseAction.apply(this, [duration, easeFunction]);
        
        this.skew = skew;
        this.delta = [0, 0];
    }
    
    ActionSkewTo.prototype.setTarget = function(target) {
        this.$super.setTarget.call(this, target);
        
        this.startSkew = target.skew;
        this.delta[0] = (this.skew[0] - target.skew[0]);
        this.delta[1] = (this.skew[1] - target.skew[1]);
    };
    
    ActionSkewTo.prototype.update = function(time) {
        this.$super.update.call(this, time);
        
        var x, y;
        if(this.delta[0] !== 0) {
            x = this.easeFunction(this.time, this.startSkew[0], this.delta[0], this.duration);
        } else {
            x = this.startSkew[0];
        }
        if(this.delta[1] !== 0) {
            y = this.easeFunction(this.time, this.startSkew[1], this.delta[1], this.duration);
        } else {
            y = this.startSkew[1];
        }
        this.target.skew = [x, y];
    };
    
    
    /**************************************************************************
     *          EASING FUNCTIONS
     **************************************************************************/
    var Easing = {
        easeInQuad: function (t, b, c, d) {
            return c * (t/=d) * t + b;
        },
        
        easeOutQuad: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        
        easeInOutQuad: function (t, b, c, d) {
            if((t /= d/2) < 1) {
                return c/2*t*t + b;
            }
            
            return -c/2 * ((--t)*(t-2) - 1) + b;    
        },
        
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        
        easeOutCubic: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        
        easeInOutCubic: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        
        easeInQuart: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        
        easeOutQuart: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        
        easeInOutQuart: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        
        easeInQuint: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        
        easeOutQuint: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        
        easeInOutQuint: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        
        easeInOutSine: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        
        easeInExpo: function(t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        
        easeOutExpo: function(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, - 10 * t / d) + 1) + b;
        },
        
        easeInOutExpo: function(t, b, c, d) {
            if (t === 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, - 10 * --t) + 2) + b;
        },
        
        easeInCirc: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        
        easeInOutCirc: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        
        easeInElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            if ((t /= d) > 0.99) return b + c;
            if (!p) p = d * 0.3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        
        easeOutElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            if ((t /= d) > 0.99) return b + c;
            if (!p) p = d * 0.3;
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, - 10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        
        easeInOutElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) return b;
            if ((t /= d / 2) > 1.99) return b + c;
            if (!p) p = d * (0.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, - 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        
        easeInBack: function(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        
        easeOutBack: function(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        
        easeInOutBack: function(t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        
        easeInBounce: function(t, b, c, d) {
            return c - Easing.easeOutBounce(d - t, 0, c, d) + b;
        },
        
        easeOutBounce: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        
        easeInOutBounce: function(t, b, c, d) {
            if (t < d / 2) return Easing.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
            return Easing.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    };
    
    
    /**************************************************************************
     *          EXPORT
     **************************************************************************/
    Actions.MoveTo = ActionMoveTo;
    Actions.SkewTo = ActionSkewTo;
    Actions.Base   = BaseAction;
    Actions.Easing = Easing;
}());