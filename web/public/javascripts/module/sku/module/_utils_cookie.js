/**
 * 封装cookie方法 --- 九游铜币消耗系统
 * @author wwl98670@alibaba-inc.com  
 * @version 1.0.0 ### 20151215
 * @update wuwl ### 
 */

define(function(require, exports, module) {

	var ucb = require('./_ucb');
	
	var app = {
		/* 获取cookie有效时间 */
		getCookieTime: function(arg) {
			var that = this;
			that.isnaturl = arg.isnaturl || 0; //是否为自然日，默认为否
			that.dayunit = parseInt(arg.dayunit) || 1; //天数单数
			if ( that.isnaturl  == 1 ) { // 判定自然日
				var now = new Date(), 
						enday = new Date();
				enday.setDate( enday.getDate() + that.dayunit );
				var year = enday.getFullYear(),
						month = enday.getMonth(),
						date = enday.getDate(),
						end = new Date(year,month,date,00,00,00);
				that.differ = end.getTime() - now.getTime();
			} else {
				that.differ = that.dayunit * 86400000;
			}
			return that.differ;			
		},
		/* 获取cookie名 */
		getCookie: function(name){
			var that = this;
			var getval = ucb.Cookie.get(name);
			return getval;
		},
		/* 判断cookie是否存在 */
		judgeCookie: function(name){
			var that = this;
			that.getcookie =  app.getCookie(name);
			if ( that.getcookie == null ) {
				return 0;
			} else {
				return 1;
			};
		},
		/* 设置cookie */
		setCookie: function(arg){
			var that = this;
			that.name	= arg.name;  //COOKIE名
			that.domain = arg.domain || "a.9game.cn"; //COOKIE域
			that.expires = arg.expires || app.getCookieTime({});		//COOKIE时间 默认为一个时间日
			
			ucb.Cookie.set(that.name,true,{
				path : "/",
				domain : that.domain,
				expires : that.expires
			});
		},
		/* 初始化cookie模块 */
		initCookie: function(arg){
			var that = this;
			that.name = arg.name;
			that.domain = arg.domain || "a.9game.cn";
			that.expires = arg.expires || app.getCookieTime({});
			that.nocookieFun = arg.nocookieFun;			
			that.hascookieFun = arg.hascookieFun;
		
			var cookiehasif = app.judgeCookie(that.name);
			
			if ( cookiehasif == 0 ) {
				if ( that.nocookieFun != null && typeof that.nocookieFun == 'function' ) {
					that.nocookieFun();
				};
				app.setCookie({
					name: that.name,
					domain : that.domain,
					expires : that.expires
				});
				
			} else {
				if ( that.hascookieFun != null && typeof that.hascookieFun == 'function' ) {
					that.hascookieFun();
				}	
			}
		}
	};
	
	module.exports = {
		getCookieTime: app.getCookieTime,
		getCookie: app.getCookie,
		judgeCookie: app.judgeCookie,
		setCookie: app.setCookie,
		initCookie: app.initCookie
	};	
	
});