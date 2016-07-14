/**
 * 业务弹窗方法 --- 九游运营活动
 * @author wwl98670@alibaba-inc.com  
 * @version 1.0.0 ### 20151129
 * @update wuwl ### 20160229 for 封装方法
 */
define(function(require, exports, module) {
	
	var popFn = require("./module/_utils_pop");

	var app = {
		/**
		 * 其他：微信蒙版事件
		 * @param {string} wxType 微信分享类型 可不填 1-拉起分享到朋友圈提示
		*/
		wxpop: function(wxattr){
			var that = this;
			var popWechat = $("#popWechat"),
					initif = popWechat.attr("data-init");
			if ( !initif ) {
				popWechat.show();
			} else {
				var html = 
					'<div class="pop-maskbg pop_close" lock="0"></div>'
					+'<div class="pop-inbox pop_close" lock="0"' + wxattr + '>'
						+'<div class="con"></div>'
					+'</div>';
				popWechat.html(html).attr("data-init",1).show();
			} 
		},
		/**
		 * 其他：客户端拉起事件
		 * @param
		 */
		pullpop: function(){
			var that = this;
			if(get_ua.isIos) {
				popFn.msgpop({
					msgarr:['本活动仅限九游app参加','前往appStore下载九游app','更多福利等着你哦'],
					btnarr:['我知道了'],
					callback:function(){
						popFn.addpopclose();
					}
				});
			}
			else{
				popFn.msgpop({
					msgarr:['本活动仅限九游app参加','快去看看吧'],
					btnarr:['马上去看看'],
					callback:function(){
						$("#pop_msg .button-content .item").addClass("pullup_btn");
					}
				});
			}

		},
	};
	
	// 绑定事件
	var bindevent = {
		init: function(){
			var that = this;
			that.creatpop();
			popFn.bindEvent();
		},
		// 生成pop
		creatpop: function(){
			var that = this;
			that.popwrap = $("#utilsPop");
			that.html = 
			'<div class="pop-maskbg pop_close"></div>'
			+'<div class="the-wrap">'
				+'<div class="pop-container" id="pop_msg">'
					+'<div class="text-content"></div>'
					+'<div class="button-content"></div>'
				+'</div>'
				+'<div class="pop-container" id="pop_load"><div class="load-content"><p class="item in_msg">请求中，请稍候……</p></div></div>'
				+'<div class="pop-container" id="pop_oth">'
				+'</div>'
			+'</div>';
			that.popwrap.html(that.html);
		},
		
	};
	bindevent.init();
	
	// 传递接口
	module.exports = {
		// 事件
		showpop: popFn.showpop,
		closepop: popFn.closepop,
		// 组件
		msgpop: popFn.msgpop,
		errpop: popFn.errpop,
		loadpop: popFn.loadpop,
		codepop: popFn.codepop,
		othpop:popFn.othpop,
		// 工具
		lockpop: popFn.lockpop,
		unlockpop: popFn.unlockpop,
		refreshpop: popFn.refreshpop,
		addpopclose: popFn.addpopclose,

		// 其他
		wxpop: app.wxpop,
		pullpop: app.pullpop,

	};

});