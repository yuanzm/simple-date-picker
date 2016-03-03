# simple-date-picker
基于zepto的移动端轻量级日期插件

### 安装
支持下面两种方式
- git clone之后直接拷贝引用bin文件夹下面的`datepicker.min.css`和`datepicker.min.js`
- 从npm下载安装：`npm install --save date_picker`

### 使用
- 引用样式`datepicker.min.css`
- 引用`datepicker.min.js`或者引用模块`var DatePicker = require('date_picker');`
- 实例化组件，绑定插件日期选择完成之后的回调函数
```
var _date = document.getElementById('date');

	var datePicker = new DatePicker({
		confirmCbk: function(data) {
            _date.value = data.year + '-' + data.month + '-' + data.day;
		}
	});

    _date.onfocus = function(e) {
    	_date.blur();
		datePicker.open();
    };
```
插件外置两个API： `open`和`close`,其中特别注意上面demo中_date在获取焦点之后里面强制去除了焦点，是为了避免安卓下面为input标签设置readonly属性并不能禁止原生键盘弹出的问题。

### 在线demo
![](https://segmentfault.com/img/bVtbOs)