/**
* @description 制作海报 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	var _method = require('../../../../cmdmodule/sku/_method'),
			_pop_method = _method.popFn;

	// 功能模块 · 滑动ul
	var slideUL = require('./slide_ul');

	// 业务模块 ·制作海报
	var app = {
		init:function(){
			var that = this;
			that.getParam();
			that.bind();
		},
		getParam: function(){
			var that = this;
			that.haibao = $("#posterMain");
			that.wenan = $("#posterCopy");
			that.haibaoSrc = that.haibao.attr("data-src");
			that.wenanSrc = that.wenan.attr("data-src");
			that.userName = $("#pageParam").attr("data-username");	
		},
		bind: function(){
			var that = this;

			// 绑定制作按钮
			$("#toStartMake").click(function(){
				_method.toclick({
					obj:$(this),
					callback:that.startMake
				})
			})

			// 绑定取消按钮
			$("#cancelMake").click(function(){
				that.cancelMake();
			})

			// 绑定提交按钮
			$("#submitMake").click(function(){
				_method.toclick({
					obj:$(this),
					callback:that.submitMake
				})
			})

			var shareFn = require('./to_share');
			// 绑定分享按钮
			$("#utilsPop").on('click','#haibaoShare',function(){
				shareFn.init({
					obj:$(this),
					method:_method
				})
			});


			// 绑定预览按钮
			$("#toLookhaibao").click(function(){
				if ( $(this).attr("look") == 1 ) {
					$(".writer-wrap").addClass("hide");
					$(this).attr("look",0)
				} else {
					$(".writer-wrap").removeClass("hide");
					$(this).attr("look",1)
				}
			});
		},

		// 进入海报制作页面
		startMake: function(){
			var pid = $("#getPosterMain").find(".focus").attr("data-id"),
					src =  app.haibaoSrc + pid + '.jpg',
					userName = app.userName,
					haibao = app.haibao,
					bodyheight = document.documentElement.clientHeight;
		
			$("#userName").html(userName);
			haibao.attr("src",src);
			
			// 切换
			$("#tomakePage").height(bodyheight).removeClass("hide");
			$("#choosePage").addClass("hide");

			slideUL.init();
			app.chooseWd();

		},

		// 取消海报制作
		cancelMake: function(){
			var wenan = app.wenan,
					src = app.wenanSrc + '1.png';

			wenan.attr("src",src);
			$("#getPosterCopy .wds").removeClass("focus");
			$("#getPosterCopy li").eq(0).find(".wds").eq(0).addClass("focus");

			// 切换
			$("#tomakePage").addClass("hide");
			$("#choosePage").removeClass("hide");
			$(".writer-wrap").removeClass("hide");

		},


		// 选择文案
		chooseWd: function(){
			var src =$("#posterCopy").attr("data-src"); 
			$("#getPosterCopy .wds").click(function(){
				var id = $(this).attr("data-id");
				$("#posterCopy").attr("src",src + id + '.png');
				$("#getPosterCopy .wds").removeClass("focus");
				$(this).addClass("focus");
			})
		},

		// 提交海报
		submitMake: function(arg){
			var surl = arg.obj.attr("data-url"),
					pid = $("#pageParam").attr("data-ucid"),
					posterMain = $("#getPosterMain").find(".focus").attr("data-id"),
					posterCopy = $("#getPosterCopy").find(".focus").attr("data-id"),
					datajson = {
						"pid":pid,
						"posterMain":posterMain,
						"posterCopy":posterCopy
					}

			$.ajax({
					type: "POST",
					url: surl,
					data: datajson,
					datatype:"json",
					timeout:6000,
					beforeSend: function(){
						_pop_method.loadpop("制作中，稍等片刻……")
					},
					success: function(response){
						
						if ( response && response.state && response.state.code ) {
							var code = response.state.code;
							if ( code == 2000000 ){
								var url = response.data;
								var html = app.createSuc(url);
								_pop_method.othpop({
									html:html,
									lock:2,
									callback: function(){
										$("#pop_oth").addClass("success");
									}
								})
							} else {
								if ( response.state.msg ) {
									var msg = response.state.msg;
								} else {
									var msg = "异常状态";
								}
								_pop_method.errpop({
									msgarr:[msg]
								})
							}
						}
					},
					error: function(xhr){
						_pop_method.errpop({
						});
					}
				});
		},

		// 创建成功反馈弹窗
		createSuc: function(url){
			var html = [];
			html.push('<div class="button-content">');
			if ( get_ua.isUC || get_ua.isWechat ||  get_ua.isNG ) {
				var sharebtn = '<div class="item isshare" id="haibaoShare" data-url="'+url+'" name="uc_act_adm" act_stat="btn_zhuxian_post_po-3"></div>';
				var bot = '<div class="share-bar"></div>';
				html.push(sharebtn);
			} else {
				var bot = '';
			}
			html.push('<div class="item isagain pop_close" name="uc_act_adm" act_stat="btn_zhuxian_post_po-4"></div>');
			html.push('</div>');
			html.push(bot);
			html = html.join("");
			return html;
		},

	
			
	}

	module.exports = app;
	
});