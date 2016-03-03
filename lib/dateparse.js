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
