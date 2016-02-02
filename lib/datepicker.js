/**
 * @author: zimyuan
 * @last-edit-date: 2015-02-02
 */
var tpl  	  = require('./datepicker.html'),
	util 	  = require('./util'),
	DateParse = require('./dateparse'),
	fastClick = require('fastclick');

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
		this._initDom();
		this._initEvents();
	},

	_initEvents: function() {
		var that = this;
		
		fastClick(document.body);

		this.$mask.on('click', function() {
			that.close.call(that, this);
		});

		this.$mPrev.on('click', this._clickPrevMonth.bind(this));
		this.$mNext.on('click', this._clickNextMonth.bind(this));
	},

	_initDom: function() {
		this.$mask    = this.$panel.find('.datapicker__mask');
		this.$dayList = this.$panel.find('.datapicker__panel'); 
		this.$yPrev   = this.$panel.find('#_j_year_prev');
		this.$yNext	  = this.$panel.find('#_j_year_next');
		this.$mPrev   = this.$panel.find('#_j_month_prev'); 
		this.$mNext   = this.$panel.find('#_j_month_next');
		this.$year    = this.$panel.find('#_j_year_text');
		this.$month   = this.$panel.find('#_j_month_text')
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
		// 保存当前信息
		this._saveCurrentData(year, month, currDate.getDay());
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

	_appendMonth: function(year, month) {
		var dayList  = this.getOneMonth(year, month),
			all_days = this._genOneMonthStr(dayList).join('');
			$newMonth = $('<ul class="datapicker__day-list">' + all_days + '</ul>');

		this.$dayList.append($newMonth);
	},

	_saveCurrentData: function(year, month, day) {
		this.data = {
			year  : year,
			month : month,
			day   : day
		};
	},

	_getCurrentData: function() {
		return this.data;
	},

	_syncDataToDom: function() {
		var curr  = this._getCurrentData();
			month = (  curr.month === 0
					 ? 12
					 : curr.month  ); 
		this.$year.text(curr.year + '年');
		this.$month.text(month + '月');
	},

	_clickPrevMonth: function() {
		var curr 	  = this._getCurrentData();
			last 	  = this.getLastMonth(curr.year, curr.month),
			prevYear  = last.year,
			prevMonth = last.month;

		$('.datapicker__day-list').remove();
		this._appendMonth(prevYear, prevMonth);

		this._saveCurrentData(prevYear, prevMonth, curr.day);
		this._syncDataToDom();
	},

	_clickNextMonth: function() {
		var curr 	  = this._getCurrentData();
			next 	  = this.getNextMonth(curr.year, curr.month),
			nextYear  = next.year,
			nextMonth = next.month;

		$('.datapicker__day-list').remove();
		this._appendMonth(nextYear, nextMonth);

		this._saveCurrentData(nextYear, nextMonth, curr.day);		
		this._syncDataToDom();
	},

	open: function() {
		this.$panel.addClass(this.config.panelShow);
	},

	close: function() {
		this.$panel.removeClass(this.config.panelShow);	
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
