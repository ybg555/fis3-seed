/**
 * 账号体系 --- 阿里游戏
 * @@账号登录体系
 * @author wwl98670@alibaba-inc.com
 * @version 1.0.0 ### 20151218
 * @update wuwl
 */

define(function (require, exports, module) {

	var app = {
		/**
		 * 获取登录信息
		 * @return 已登录则返回ucid 否则就返回false

		*/
		isLogin: function(){
			var that = this;
			var isLogin = false;
			if ( get_ua.isNG ) {
				var rsp = JSBridge.callNative('NineGameClient', 'getAccountInfo');
				if ( typeof(rsp) == "object" ) {
					rsp = rsp;
				} else {
					rsp = JSON.parse(rsp);
				}
				if (rsp && rsp.data && (rsp.data.ucid > 0)) {
					var ucid = rsp.data.ucid;
					isLogin = true;
					return ucid;
				}
			} else {
				if ( typeof($("#pageParam").attr("data-ucid")) != "undefined" && $("#pageParam").attr("data-ucid") != null && $("#pageParam").attr("data-ucid").length > 0 )  {
					var ucid = $("#pageParam").attr("data-ucid");
					isLogin = true;
					return ucid;
				} 
			}
			return false;	
		},
		/**
		 * 拉起登录
		 * @param 端内调接口 端外跳转ucapi
		*/
		pullLogin: function(){
			var that = this;
			if ( get_ua.isNG ) {
				JSBridge.callNative("NineGameClient", "login", {
					"loginInfo":{
						"type":"floatview",
						"tag":"subscribeGift",
						"title":"登录",
						"content":"登录领取礼包",
						"account":"",
						"accountType":"default"
					}
				}, function(){
					console.log("登录get")
				});
			} else {
				var host = $("#pageParam").attr("data-host")
				window.location.href = host;
			}
		},
			
	};

	// 传递
	module.exports = {

		isLogin: app.isLogin,
		pullLogin: app.pullLogin

	};

});