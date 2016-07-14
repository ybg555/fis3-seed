/**
 * 通用业务方法 --- 九游运营活动
 * @author wwl98670@alibaba-inc.com  
 * @version 1.0.0 ### 20151129
 * @update wuwl ### 20160229 for 添加vermobilePop方法
 */
define(function(require, exports, module) {

	var _pop_method = require("./pop"),
			_account_method = require("./account"),
			_pullup = require("./pullup");

	var pageParam = $("#pageParam");

	var app = {
		/**
		 * 封装点击事件
		 * @param {object} arg
		 * @param {string} [arg.obj] 选择器，默认就是当前按钮
		 * @param {string} [arg.lock] 是否锁定: 1-锁定 
		 * @param {string} [arg.needLogin] 需要登录 1-需要 
		 * @param {string} [arg.lockFun] 锁定时候的方法 默认为 return
		 * @param {function} [arg.callback] 传递入当前arg的回调函数
		*/
		toclick: function(arg){
			var that = this;
			that.obj = arg.obj || $(this);
			that.lock = that.obj.attr("lock");
			that.needLogin = that.obj.attr("need-login");
			that.needpullup = that.obj.attr("need-pullup");
			that.oncepullup = that.obj.attr("once-pullup");
			that.wxLimit = that.obj.attr("wx-limit");

			
			// 需要进行微信限制
			if ( that.wxLimit == 1 && get_ua.isWechat ) {
				var wxattr = arg.wxattr || '';
				_pop_method.wxpop(wxattr);
				return;
			}

			// 需要登录
			if ( that.needLogin == 1 && !_account_method.isLogin() ) {
					 _account_method.pullLogin();
					return;
			}

			// 立即拉起客户端
			if ( that.oncepullup == 1 && !get_ua.isNG ) {
				if ( get_ua.isWechat ) {
					_pop_method.wxpop('');
				} else {
					_pullup.topullup(that.obj);
				}
				return;
			}

			// 弹窗拉起客户端
			if ( that.needpullup == 1 && !get_ua.isNG ) {
				_pop_method.pullpop();
				return;
			}
			
			// 执行实际操作
			if ( that.lock == 1 ) {
				if ( arg.lockFun && arg.lockFun instanceof Function ) {
					arg.lockFun(arg);
				} else {
					return;
				}
			} else {
				if ( arg.callback && arg.callback instanceof Function ) {
					arg.callback(arg);
				} else {
					return;
				}
			}
		},
		/**
		 * 正则式验证 · 1-通过 0-未通过
		 * @param {reg} reg 正则式规则
		 * @param {string} val 验证字符串
		*/
		checkreg: function(reg,val) {
			if ( !reg.test(val) ) {
				return 0; 
      } else {
				return 1;
			}
		},	
		/**
		 * 锁定按钮
		 * @param {object} obj
		*/
		lockbtn: function(obj){
			obj.attr("lock",1);
		},
		/**
		 * 解锁按钮
		 * @param {object} obj
		*/
		unlockbtn: function(obj){
			obj.attr("lock",0);
		},
		
		/**
		 * 转换数据格式为json
		 * @param {object} getdata
		*/
		parseData:function(getdata){
			var that = this;
			if ( typeof(getdata) == "object" && Object.prototype.toString.call(getdata).toLowerCase() == "[object object]" && !getdata.length ) {
				that.getdata = getdata;
			} else {
				that.getdata = JSON.parse(getdata);
			}
			return that.getdata;
		},
		
	};

	// 绑定事件
	var bindevent = {
		init: function(){
			var that = this;
			$(document).on("tap",".pullup_btn",function(e){
				if ( get_ua.isWechat ) {
					_pop_method.wxpop('');
				} else {
					_pullup.topullup(that.obj);
				}
			});
		},
	};
	bindevent.init()
	
	// 传递接口
	module.exports = {

		toclick: app.toclick,
		lockbtn: app.lockbtn,
		unlockbtn: app.unlockbtn,
		checkreg: app.checkreg,
		parseData: app.parseData,

		popFn: _pop_method,
		accountFn: _account_method


	};
	
});