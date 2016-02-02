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

	getLastMonth: function(year, month) {
		var lastMonth = (  month - 1 < 0
					 ? 11
					 : month - 1  ),
			lastYear  = (  month - 1 < 0
					 ? year - 1
					 : year  );

		return {
			year  : lastYear,
			month : lastMonth 
		};
	},

	getNextMonth: function(year, month) {
		var nextMonth = (  month + 1 > 11
						 ? 0
						 : month + 1  );
			nextYear = (  month + 1 > 11
						? year + 1
						: year  );

		return {
			year  : nextYear,
			month : nextMonth
		};
	},

	getOneMonth: function(year, month) {
		// 本月数据
		var days  = this.getDaysInMonth(year, month),
			week  = this.getFirstdayWeek(year, month),
			last  = this.getLastDayInMonth(year, month).getDay();

		var lastMonth = (  month - 1 < 0
						 ? 11
						 : month - 1  ),
			lastYear  = (  month - 1 < 0
						 ? year - 1
						 : year  );
			ldays     = this.getDaysInMonth(lastYear, lastMonth);

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
