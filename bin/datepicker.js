(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.DatePicker = require('./index.js');
},{"./index.js":2}],2:[function(require,module,exports){
module.exports = require('./lib/datepicker').DatePicker;

},{"./lib/datepicker":4}],3:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2016-02-13
 */

/**
 * @constructor
 * @desc: 封装常用Date处理函数
 */ 
function DateParse() {

}

DateParse.prototype = {
	/**
	 * @desc: 获取一个月的天数
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Number}       : 所求月份的天数
	 */
	getDaysInMonth: function(year, month) {
		return new Date(year, month, 0).getDate();
	},

	/**
	 * @desc: 获取一个月的第一天是星期几
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Number}       : 0-6，分别代表星期日到星期六
	 */
	getFirstdayWeek: function(year, month) {
		return new Date(year, month - 1, 1).getDay();
	},

	/**
	 * @desc: 获取一个月的最后一天
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Date}         : 所求月份最后一天的日期对象 
	 */
	getLastDayInMonth: function(year, month) {
		return new Date(year, month - 1, this.getDaysInMonth(year, month));
	},	

	/**
	 * @desc: 获取某一个月上个月的`年`和`月`
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Object}       : 包含上个月`年`和`月`信息的对象  
	 */
	getLastMonth: function(year, month) {
		var lastMonth = (  month - 1 === 0
					 ? 12
					 : month - 1  ),
			lastYear  = (  month - 1 === 0
					 ? year - 1
					 : year  );

		return {
			year  : lastYear,
			month : lastMonth 
		};
	},

	/**
	 * @desc: 获取某一个月下个月的`年`和`月`
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Object}       : 包含下个月`年`和`月`信息的对象  
	 */	
	 getNextMonth: function(year, month) {
		var nextMonth = (  month + 1 === 12
						 ? 0
						 : month + 1  );
			nextYear = (  month + 1 === 12
						? year + 1
						: year  );

		return {
			year  : nextYear,
			month : nextMonth
		};
	},

	/**
	 * @desc: 封装`一个月`中上个月的几天
	 * @param  {Number} year  : 当月的年份
	 * @param  {Number} month : 从1开始计算的当月月份
	 * @return {Array}  list  : 上个月数据数组
	 */	
	_packLastMonthDays: function(year, month, week) {
		var temp       = null,
			list       = [],
			lastMonth  = this.getLastMonth(year, month),
			ldays      = this.getDaysInMonth(lastMonth.year, lastMonth.month);
			startIndex = (  week === 0
						  ? 6
						  : week - 1  );

		for ( var i = startIndex; i >= 0;i-- ) {
			temp = {
				num  : ldays - i,
				gray : 1
			};

			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 封装`一个月`中上个月的几天
	 * @param  {Number} week  : 本月最后一天的星期
	 * @return {Array}  list  : 下个月数据数组
	 */	
	_packNextMonthDays: function(week, appendNum) {
		var list      = [],
			temp 	  = null,
			appendNum = appendNum || 0,
			endIndex  = (  week < 6
						 ? ( 6 - week )
						 : ( 6 - week ) + 7  );

		// 打包下个月数据头几天数据
		for ( var i = 1;i <= endIndex + appendNum;i++ ) {
			temp = {
				num  : i,
				gray : 1  
			};
			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 封装当月天数
	 * @param  {Number} days  : 当月的总天数
	 * @param  {Number} curr  : 当前日期
	 * @return {Array}  list  : 当月数据数组
	 */	
	_packCurrMonthDays: function(days, curr) {
		var list = [],
			temp = null;

		// 打包本月数据
		for ( var i = 1;i <= days;i++ ) {
			temp = {
				num  : i,
				gray : 0  
			};

			temp.active = (  i === curr
						   ? 1
						   : 0  );

			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 获取给定`年月日`的对应月份数据
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始的月份 
	 * @param  {Number} day   : 从1开始的日期
	 * @return {Array}  list  : 对应月份数据数组
	 */	
	getOneMonth: function(year, month, day) {
		// 本月数据
		var days  = this.getDaysInMonth(year, month),
			week  = this.getFirstdayWeek(year, month),
			last  = this.getLastDayInMonth(year, month).getDay();

		var list = [];

		var lastMonth = this._packLastMonthDays(year, month, week),
			currMonth = this._packCurrMonthDays(days, day),
			appendNum = (  lastMonth.length + currMonth.length < 35
						 ? 7
						 : 0  ),
			nexMonth  = this._packNextMonthDays(last, appendNum); 

		list = list.concat(lastMonth, currMonth, nexMonth);

		return list;
	}
};

module.exports = DateParse;

},{}],4:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2015-03-03
 */

var tpl  	  = require('./datepicker_tpl'),
	util 	  = require('./util'),
	DateParse = require('./dateparse'),
	fastClick = require('fastclick');

// 组件默认配置
var _defaultConfig = {
	minDate    : '',
	maxDate    : '',
	currDate   : new Date(),
	panelShow  : 'datepicker_show',
	grayCls    : 'datepicker__day-item_gray',
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
		var that   = this;
			aniEvt = util.whichTransitionEvent();

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

		this.$panel.on(aniEvt, '.datepicker__day-list_prev', function() {
			$(this).remove();	
		});

		this.$panel.on(aniEvt, '.datepicker__day-list_next', function() {
			$(this).remove();	
		});

		this.$panel.on(aniEvt, '.datepicker__mask', function() {
			if ( !that.$picker.hasClass(that.config.panelShow) )
				that.$picker.addClass('ui-d-n');
		});
	},

	_initDom: function() {
		this.$picker  = $('.datepicker'); 
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

	open: function(el) {
		var that = this;

		that.$el = (  el
					? el
					: null  );		

		that.$picker.removeClass('ui-d-n');
		setTimeout(function() {
			that.$panel.addClass(that.config.panelShow);
		}, 30);
	},

	close: function() {
		var that = this;

		that.$panel.removeClass(that.config.panelShow);	
		setTimeout(function() {
			that.$picker.addClass('ui-d-n');
		}, 310);
	}
};

util.extend(prototype, DatePicker.prototype);
module.exports = {
	DatePicker: DatePicker
};

},{"./dateparse":3,"./datepicker_tpl":5,"./util":6,"fastclick":7}],5:[function(require,module,exports){
var tpl = [
	'<div class="datepicker ui-d-n">',
	'	<div class="datepicker__mask"></div>',
	'	<div class="datepicker__main">',
	'		<div class="datepicker__header">',
	'			<div class="datepicker__time-toggle"></div>',
	'			<div class="datepicker__time-selector-list">',
	'				<div class="datepicker__time-selector-item">',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_year_prev">&lt;</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_year_text">{year}年</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_year_next">&gt;</a>',
	'				</div>',
	'				<div class="datepicker__time-selector-item">',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_month_prev">&lt;</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_month_text">{month}月</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_month_next" >&gt;</a>',
	'				</div>',
	'			</div>',
	'		</div>',
	'		<div class="datepicker__panel">',
	'			<ul class="datepicker__week-list">',
	'				<li class="datepicker__week-item">日</li>',
	'				<li class="datepicker__week-item">一</li>',
	'				<li class="datepicker__week-item">二</li>',
	'				<li class="datepicker__week-item">三</li>',
	'				<li class="datepicker__week-item">四</li>',
	'				<li class="datepicker__week-item">五</li>',
	'				<li class="datepicker__week-item">六</li>',
	'			</ul>',
	'			<div class="datepicker__day-wrap">',
	'				<ul class="datepicker__day-list datepicker__day-list-curr">',
	'					{all_days}',
	'				</ul>',
	'			</div>',
	'		</div>',
	'		',
	'		<div class="datepicker__footer">',
	'			<div class="datepicker__btn" id="_j_confirm_btn">确定</div>',
	'			<div class="datepicker__btn" id="_j_cancel_btn">取消</div>',
	'		</div>',
	'	</div>',
	'</div>'
].join("");

module.exports = tpl;

},{}],6:[function(require,module,exports){
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
	}
};

module.exports = util;

},{}],7:[function(require,module,exports){
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

},{}]},{},[1]);
