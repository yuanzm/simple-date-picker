/**
 * @author: zimyuan
 * @last-edit-date: 2015-02-13
 */

var tpl  	  = require('./datepicker.html'),
	util 	  = require('./util'),
	DateParse = require('./dateparse'),
	fastClick = require('fastclick');

// 组件默认配置
var _defaultConfig = {
	minDate    : '',
	maxDate    : '',
	currDate   : new Date(),
	panelShow  : 'datepicker_show',
	activeCls  : 'datepicker__day-item_active',
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

		this.$panel.on('click', '.datepicker__day-item', function(e) {
			that._onClickDayBtn.call(that, this);
		});

		this.$panel.on('webkitTransitionEnd', '.datepicker__day-list_prev', function() {
			$(this).remove();	
		});

		this.$panel.on('webkitTransitionEnd', '.datepicker__day-list_next', function() {
			$(this).remove();	
		});
	},

	_initDom: function() {
		this.$mask    = this.$panel.find('.datepicker__mask');
		this.$dayList = this.$panel.find('.datepicker__day-wrap'); 
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
		this._saveCurrentData(year, month, currDate.getDate());
	},

	_genOneMonthStr: function(list) {
		var htmlArr = [],
			base    = 'datepicker__day-item ',
			gray    = 'datepicker__day-item_gray',
			active  = 'datepicker__day-item_active',
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

	_appendMonth: function(year, month, day, isprev) {
		var dayList  = this.getOneMonth(year, month, day),
			all_days = this._genOneMonthStr(dayList).join('');
			_class   = (  isprev
						? 'datepicker__day-list datepicker__day-list_prev'
						: 'datepicker__day-list datepicker__day-list_next'  ),
			$newMonth = $('<ul class="' + _class + '">' + all_days + '</ul>');

		this.$dayList.append($newMonth);
	},

	_toggleMonth: function(newYear, newMonth, newDay, isprev) {
		this._appendMonth(newYear, newMonth, newDay, isprev);

		this._saveCurrentData(newYear, newMonth, newDay);
		this._syncDataToDom();

		var _curr   = 'datepicker__day-list-curr', 
			_class1 = ( isprev
					   ? 'datepicker__day-list_prev'
					   : 'datepicker__day-list_next' ),
			_class2 = ( isprev
					   ? 'datepicker__day-list_next'
					   : 'datepicker__day-list_prev'  );		

		var $curr = $('.' + _curr);

		setTimeout(function() {
			$('.' + _class1).removeClass(_class1).addClass(_curr);
			$curr.addClass(_class2).removeClass(_curr);
		}, 0);
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

		this._toggleMonth(prevYear, prevMonth, curr.day, 1);
	},

	_clickNextMonth: function() {
		var curr 	  = this._getCurrentData();
			next 	  = this.getNextMonth(curr.year, curr.month),
			nextYear  = next.year,
			nextMonth = next.month;

		this._toggleMonth(nextYear, nextMonth, curr.day, 0);
	},

	_clickPrevYear: function() {
		var curr 	  = this._getCurrentData();

		this._toggleMonth(curr.year - 1, curr.month, curr.day, 1);
	},

	_clickNextYear: function() {
		var curr 	  = this._getCurrentData();

		this._toggleMonth(curr.year + 1, curr.month, curr.day, 0);		
	},

	_onClickDayBtn: function(btn) {
		var grayCls   = this.config.grayCls,
			activeCls = this.config.activeCls,
			curr 	  = this._getCurrentData(), 
			$day      = $(btn);

		if ( $day.hasClass(grayCls) || $day.hasClass(activeCls) )
			return;

		$('.datepicker__day-item').removeClass(activeCls);
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
