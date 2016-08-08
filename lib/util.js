/**
 * @author: zimyuan
 * @last-edit-date: 2015-01-23
 */

var util = {
	inheritPrototype: function(subClass, superClass) {
		var prototype = Object.create(superClass.prototype);

		prototype.constructor = subClass;
		subClass.prototype    = prototype; 
	},

	extend: function(_old, _new) {
		for ( var key in _old ) {
			_new[key] = _old[key];
		}
	},

	format: function(tpl, obj) {
	    tpl = tpl + '';
	    return tpl.replace(/\{(\w+)\}/g, function(m, n) {
	        return obj[n] !== undefined ? obj[n].toString() : m;
	    });
	},

	// http://stackoverflow.com/questions/13823188/android-4-1-change-transition-and-webkittransition-defiend-how-to-properly-de
	whichTransitionEvent: function() {
	    var t,
	    	el = document.createElement('fakeelement');
	    	transitions = {
		        'OTransition'       :'oTransitionEnd',
		        'MSTransition'      :'msTransitionEnd',
		        'MozTransition'     :'transitionend',
		        'WebkitTransition'  :'webkitTransitionEnd',
		        'transition' 		:'transitionEnd'
		    };

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }

	    return false;
	},
	
	generateUUID: function() {
	    var d = new Date().getTime();
	    if(window.performance && typeof window.performance.now === "function"){
	        d += performance.now(); //use high-precision timer if available
	    }
	    var uuid = 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}
};

module.exports = util;
