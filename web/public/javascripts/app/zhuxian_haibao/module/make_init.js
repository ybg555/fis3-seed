/**
* @description 渲染制作海报 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// 功能模块 · 预加载
	var app = {
		init: function(){
			var that = this;

			var _preload_fun = require('./img_preload');

			var winWidth = document.documentElement.clientWidth;
			if ( winWidth < 720 ) {
				$("body").addClass("ismake");
				_preload_fun.init({
					element : $(".js_preload"),
					finishedFunc : function(){
						setTimeout(function(){
							rolegallery.init();
						}, 500);
					}
				});
			} else {
				$(".loader-wrapper").remove();
				$("#pcPage").removeClass("hide");
				$("body").addClass("ispc");

			}
		}
	};

	// 功能模块 · 人物画廊
	var rolegallery = {
		init:function(){
			var gallery = require('./gallery'); 
			var args = {
				picscale: 0.75,
				duration: 400,
				initFun:function(){
					$(".loader-wrapper").remove();
					$('.page-wrapper').removeClass("hide");
				}
			};
			gallery($('.gallery-wrap'), args);
		}
	}

	module.exports = app;
	
});