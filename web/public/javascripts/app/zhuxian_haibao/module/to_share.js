/**
* @description 分享事件 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// 业务模块 分享
	var app = {
		init:function(arg){
			var that = this;
			that.obj = arg.obj;
			that.method = arg.method;
			that.ua = that.method.uaFn;
			that.url = that.obj.attr("data-url");
			that.bind();
		},
		getShareData: function(){
			var that = this;
			var shareParam = JSON.parse($("#pageParam").attr("data-share")),
					icon = "http://image.uc.cn/s/uae/g/0y/ngp_gamespe/zhuxian_haibao/icon.jpg";
			return {
				"title"    : shareParam.title,
				"content"  : shareParam.content,
				"shareUrl" : that.url,
				"imgUrl"   : icon,
				"iconUrl"  : icon,
			}
		},
		bind: function(){
			var that = this;
			var shareinfo = app.getShareData();

			if ( that.ua.isNG() ) {
                shareinfo.platform = "qq,qzone,wechat,wechat_timeline,sina,qqweibo";
                //console.log(JSON.stringify(shareinfo));
				// app分享
				JSBridge.callNative("NineGameClient", "share", {
					"shareInfo": shareinfo
				});
			} else if ( that.ua.isUc() ) {
				// uc分享
				if ( that.ua.isIos() ) {
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
			} else if ( that.ua.isWechat() ) {
				app.method.popFn.wxpop('istimeline');
				// 微信内分享
				app.wxshare(shareinfo.shareUrl)
			}
		},
		// 微信分享事件
		wxshare: function(link){
			var shareinfo = app.getShareData();
			if ( typeof(wx) != 'undefined' ) {
				wx.ready(function(){ 
					var title = shareinfo.title;
					var desc = shareinfo.content;
					var imgurl = shareinfo.imgUrl;

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

					wx.onMenuShareAppMessage({
					    title: title, // 分享标题
					    desc:desc,
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