/**
 * @author: zimyuan
 * @last-edit-date: 2015-02-02
 */
var tpl  	  = require('./datepicker.html'),
	util 	  = require('./util'),
	DateParse = require('./dateparse'),
	fastClick = require('fastclick');

var _defaultConfig = {
	minDate    : '',
	maxDate    : '',
	currDate   : new Date(),
	panelShow  : 'datepicker_show',
	activeCls  : 'datapicker__day-item_active',
	confirmCbk : null
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

		this.$cancel.on('click', this.close.bind(this))
		this.$mask.on('click',   this.close.bind(this));
		this.$mPrev.on('click',  this._clickPrevMonth.bind(this));
		this.$mNext.on('click',  this._clickNextMonth.bind(this));
		this.$yPrev.on('click',  this._clickPrevYear.bind(this));
		this.$yNext.on('click',  this._clickNextYear.bind(this));
		this.$confirm.on('click', this._onClickConfirm.bind(this));

		this.$panel.on('click', '.datapicker__day-item', function(e) {
			that._onClickDayBtn.call(that, this);
		});
	},

	_initDom: function() {
		this.$mask    = this.$panel.find('.datapicker__mask');
		this.$dayList = this.$panel.find('.datapicker__panel'); 
		this.$yPrev   = this.$panel.find('#_j_year_prev');
		this.$yNext	  = this.$panel.find('#_j_year_next');
		this.$mPrev   = this.$panel.find('#_j_month_prev'); 
		this.$mNext   = this.$panel.find('#_j_month_next');
		this.$year    = this.$panel.find('#_j_year_text');
		this.$month   = this.$panel.find('#_j_month_text');
		this.$cancel  = this.$panel.find('#_j_cancel_btn');
		this.$confirm = this.$panel.find('#_j_confirm_btn');
	},

	_appendPanel: function() {
		var that 	 = this,
			currDate = this.config.currDate,
			year     = currDate.getFullYear(),
			month    = currDate.getMonth() + 1,
			day   	 = currDate.getDate(),
			dayList  = that.getOneMonth(year, month, day),
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

	_appendMonth: function(year, month, day) {
		var dayList  = this.getOneMonth(year, month, day),
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
		this._appendMonth(prevYear, prevMonth, curr.day);

		this._saveCurrentData(prevYear, prevMonth, curr.day);
		this._syncDataToDom();
	},

	_clickNextMonth: function() {
		var curr 	  = this._getCurrentData();
			next 	  = this.getNextMonth(curr.year, curr.month),
			nextYear  = next.year,
			nextMonth = next.month;

		$('.datapicker__day-list').remove();
		this._appendMonth(nextYear, nextMonth, curr.day);

		this._saveCurrentData(nextYear, nextMonth, curr.day);		
		this._syncDataToDom();
	},

	_clickPrevYear: function() {
		var curr 	  = this._getCurrentData();

		$('.datapicker__day-list').remove();
		this._appendMonth(curr.year - 1, curr.month, curr.day);

		this._saveCurrentData(curr.year - 1, curr.month, curr.day);		
		this._syncDataToDom();
	},

	_clickNextYear: function() {
		var curr 	  = this._getCurrentData();

		$('.datapicker__day-list').remove();
		this._appendMonth(curr.year + 1, curr.month, curr.day);

		this._saveCurrentData(curr.year + 1, curr.month, curr.day);		
		this._syncDataToDom();

	},

	_onClickDayBtn: function(btn) {
		var grayCls   = this.config.grayCls,
			activeCls = this.config.activeCls,
			curr 	  = this._getCurrentData(), 
			$day      = $(btn);

		if ( $day.hasClass(grayCls) || $day.hasClass(activeCls) )
			return;

		$('.datapicker__day-item').removeClass(activeCls);
		$day.addClass(activeCls);

		this._saveCurrentData(curr.year, curr.month, parseInt($day.text()));
	},

	_onClickConfirm: function() {
		var curr = this._getCurrentData();

		this.close();
		this.config.confirmCbk && this.config.confirmCbk(curr); 
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
