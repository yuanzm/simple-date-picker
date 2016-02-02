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
	}
};

module.exports = util;
