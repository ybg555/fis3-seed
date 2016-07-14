/**
* @description 分享事件 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// var  popTips=require('./popTips');
	var _method = require("../../../../cmdmodule/sku/_method");
	
	// 业务模块 分享
	var app = {
		init:function(arg){
			var that = this;
			that.obj = arg.obj;    //sharebtn
			that.method = arg.method;    //method
			that.url = window.location.href;
			that.camp=arg.camp;
			that.bind();
		},

		//拿到data-share里的数据,并且根据要求组合成json字段
		getShareData: function(){
			var that = this;
			var shareParam = JSON.parse($("#shareParam").attr("data-share")),
					icon = "http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/icon.jpg";
			return {
				"title"    : shareParam.title,
				"content"  : shareParam.content,
				"shareUrl" : that.url,
				"imgUrl"   : icon,
				"iconUrl"  : icon
			}
		},

		//触发分享事件
		bind: function(){
			var that = this;
			var shareinfo = app.getShareData();
			shareinfo.content="#我叫MT3#来自艾泽拉斯的请求："+that.camp+"请求队伍支援，是否前往增援？【接受】【不接受】http://live.9game.cn"
			if ( get_ua.isNG  ) {
				// app分享
				JSBridge.callNative("NineGameClient", "share", {
					"shareInfo": shareinfo
				});
			} else if ( get_ua.isUC ) {
				// uc分享
				if ( get_ua.isIos ) {
					ucbrowser.web_shareEX(JSON.stringify({
						"title"     : shareinfo.title,
						"content"   : shareinfo.content,
						"sourceUrl" : shareinfo.shareUrl,
						"target"    : "",
						"disableTarget":"",
						"source"    : "(@uc浏览器)",
						"htmlNode"  : "",
						"imageUrl"  : shareinfo.imgUrl
					}));
				} else {
					ucweb.startRequest("shell.page_share", [
						shareinfo.title, 
						shareinfo.content, 
						shareinfo.shareUrl, 
						"", 
						"", 
						"(@uc浏览器)", 
						""
					]);
				}
			} else if ( get_ua.isWechat) {

				_method.toclick({obj:that.obj,wxattr:"shareMask"});

				// 微信内分享
				app.wxshare(shareinfo.shareUrl);
				
			}
		},

		// 微信分享事件
		wxshare: function(link){
			var that=this;
			if ( typeof(wx) != 'undefined' ) {
				wx.ready(function(){ 
					var title = that.camp+"请求队伍支援 是否前往支援?";
					var desc = that.camp+"请求队伍支援 是否前往支援?";
					var imgurl = "http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/icon.jpg";


					//分享到朋友圈的api调用
					wx.onMenuShareTimeline({
					  title: title, // 分享标题
					  link: link,// 分享链接
					  imgUrl: imgurl,// 分享图标
					  // 用户确认分享后执行的回调函数
					  success: function () { 
					  	console.log("分享成功")  
					  },
					  // 用户确认分享后执行的回调函数
					  cancel: function () { 
							console.log("cancel")  
					  }
					});

					//分享给微信好友的api调用
					wx.onMenuShareAppMessage({
					    title: title, // 分享标题
					    desc:desc,       //分享描述
					    type:'',
					    dataUrl:'',
					    link: link, // 分享链接
					    imgUrl: imgurl, // 分享图标
					    success: function () { 
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});

					//分享到qq的api调用
					wx.onMenuShareQQ({
					    title: title, // 分享标题
					    desc: desc,
					    link: link, // 分享链接
					    imgUrl: imgurl, // 分享图标
					    success: function () { 
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});

				});	
			}
			
		}
			
	}

	module.exports = app;
	
});