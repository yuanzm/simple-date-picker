(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.DatePicker = require('./index.js').DatePicker;
},{"./index.js":2}],2:[function(require,module,exports){
module.exports = require('./lib/datepicker');
},{"./lib/datepicker":5}],3:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2016-02-02
 */

function DateParse() {
	
}

DateParse.prototype = {
	// 获取一个月有多少天
	getDaysInMonth: function(year, month) {
		return new Date(year, month, 0).getDate();
	},

	// 获取一个月的第一天是星期几
	getFirstdayWeek: function(year, month) {
		return new Date(year, month - 1, 1).getDay();
	},

	// 获取一个月的最后一天
	getLastDayInMonth: function(year, month) {
		return new Date(year, month - 1, this.getDaysInMonth(year, month));
	},	

	getOneMonth: function(year, month) {
		// 本月数据
		var days  = this.getDaysInMonth(year, month),
			week  = this.getFirstdayWeek(year, month),
			last  = this.getLastDayInMonth(year, month).getDay();

		// TODO: 跨年的情况
		var lastMonth = month - 1,
			ldays     = this.getDaysInMonth(year, lastMonth);

		var list = [],
			temp    = '';

		// 打包上个月末几天数据
		if ( week > 0 ) {
			for ( var i = week - 1; i >= 0;i-- ) {
				temp = {
					num  : ldays - i,
					gray : 1
				};
				list.push(temp);
			}
		}
		// 打包本月数据
		for ( var i = 1;i <= days;i++ ) {
			temp = {
				num  : i,
				gray : 0  
			};

			temp.active = (  i === this.config.currDate.getDay()
						   ? 1
						   : 0  );

			list.push(temp);
		}
		// 打包下个月数据头几天数据
		if ( last < 6 ) {
			for ( var i = 1;i <= ( 6 - last );i++ ) {
				temp = {
					num  : i,
					gray : 1  
				};
				list.push(temp);
			}
		}

		return list;
	}
};

module.exports = DateParse;

},{}],4:[function(require,module,exports){
module.exports = "<div class=\"datepicker\">\r\n\t<div class=\"datapicker__mask\"></div>\r\n\t<div class=\"datapicker__main\">\r\n\t\t<div class=\"datapicker__header\">\r\n\t\t\t<div class=\"datapicker__time-toggle\"></div>\r\n\t\t\t<div class=\"datapicker__time-selector-list\">\r\n\t\t\t\t<div class=\"datapicker__time-selector-item\">\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-arrow datapicker__time-selector-prev\">&lt;</a>\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-text\">{year}</a>\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-arrow datapicker__time-selector-next\">&gt;</a>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"datapicker__time-selector-item\">\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-arrow datapicker__time-selector-prev\">&lt;</a>\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-text\">{month}月</a>\r\n\t\t\t\t\t<a href=\"javascript:;\" class=\"datapicker__time-selector-arrow datapicker__time-selector-next\">&gt;</a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"datapicker__panel\">\r\n\t\t\t<ul class=\"datapicker__week-list\">\r\n\t\t\t\t<li class=\"datapicker__week-item\">日</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">一</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">二</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">三</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">四</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">五</li>\r\n\t\t\t\t<li class=\"datapicker__week-item\">六</li>\r\n\t\t\t</ul>\r\n\t\t\t<ul class=\"datapicker__day-list\">\r\n\t\t\t\t{all_days}\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"datapicker__footer\">\r\n\t\t\t<div class=\"datapicker__btn\">确定</div>\r\n\t\t\t<div class=\"datapicker__btn\">取消</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

},{}],5:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2015-02-02
 */
var tpl  	  = require('./datepicker.html'),
	util 	  = require('./util'),
	DateParse = require('./dateparse');

var _defaultConfig = {
	minDate   : '',
	maxDate   : '',
	currDate  : new Date(),
	panelShow : 'datepicker_show'
};

function DatePicker(options) {
	this.config = $.extend(_defaultConfig, options || {});

	this._init();
}

// 类的继承
util.inheritPrototype(DatePicker, DateParse);

var prototype = {
	_init: function() {
		this._appendPanel();
	},

	_initEvents: function() {

	},

	_appendPanel: function() {
		var that 	 = this,
			currDate = this.config.currDate,
			year     = currDate.getFullYear(),
			month    = currDate.getMonth() + 1,
			dayList  = that.getOneMonth(year, month),
			rdata    = {
				year     : year,
				month    : month,
				all_days : that._genOneMonthStr(dayList).join('')
			};

		this.$panel = $(util.format(tpl, rdata));
		$("body").append(this.$panel);
	},

	_initDom: function() {

	},

	_genOneMonthStr: function(list) {
		var htmlArr = [],
			base    = 'datapicker__day-item ',
			gray    = 'datapicker__day-item_gray',
			active  = 'datapicker__day-item_active',
			_class   = '',
			temp    = '';

		for ( var i = 0, il = list.length;i < il;i++ ) {
			_class = (  list[i].gray  
					 ? base + gray
					 : base  );
			_class = ( list[i].active
				      ? _class + active
				      : _class  );
			temp = '<li class="' + _class + '">' + list[i].num + '</li>';
			htmlArr.push(temp);
		}

		return htmlArr;
	},

	open: function() {
		this.$panel.addClass(this.config.panelShow);
	}
};

util.extend(prototype, DatePicker.prototype);
module.exports = {
	DatePicker: DatePicker
};

var datePicker = new DatePicker();
setTimeout(function() {
	datePicker.open();
}, 0);

},{"./dateparse":3,"./datepicker.html":4,"./util":6}],6:[function(require,module,exports){
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

},{}]},{},[1]);
