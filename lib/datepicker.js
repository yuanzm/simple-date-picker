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
