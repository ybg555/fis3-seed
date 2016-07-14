/**
* @description 渲染预约页 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// 功能模块 · 预加载
	var app = {
		init: function(){
			var that = this;
			var _preload_fun = require('./img_preload');
			_preload_fun.init({
				element : $(".js_preload"),
				finishedFunc : function(){
					setTimeout(function(){
						$(".loader-wrapper").remove();
						$('.page-wrapper').removeClass("hide");
						pageflip.init();
					}, 500);
				}
			});
		}
	};

	// 功能模块 · 滑屏
	var pageflip = {
		init: function(){
			var that = this;
			var _flip_fun  = require('./flip_page');
			that.initFun();
			_flip_fun.init({
				flip        : "Y",
				wrapperObj  : pageflip.mainbg,
				itemsObj    : $(".flip_page_item"),
				action      : true,
				startedFunc : that.startFun,
				finishedFunc : that.endFun
			});
		},
		// 初始化
		initFun: function(){
			var that = this;
			that.mainbg = $(".flip_page_list");
			that.total = $(".flip_page_item").length;
			that.max = that.total;
			$("body,html").css({
				"height":"100%",
				"overflow":"hidden"
			});
			var height = document.documentElement.clientHeight;
			$(".haibao-wrap").height(height);
			$("#down_arr").addClass("animated");

			that._getNext(1);
		},
		// 切换前方法
		startFun: function(obj){
			var that = this;
			obj.removeClass("to_active");
		},
		// 切换后方法
		endFun: function(obj){
			var that = this;
			var _index = obj.index();
			obj.addClass("to_active");
			if( _index ) {
				if ( _index < pageflip.max ) {
					pageflip._getNext(obj.index());
				}
				if ( _index == pageflip.max ) {
					$("#down_arr").hide();
				}
			} 
		},	
		
		// 设置src
		_setImgSrc : function(obj, src){
			var img = new Image();
			img.src = src;
			if(!img.complete){
				img.onerror = img.onload = function(){
					obj.src = this.src;
				}
			}
			else{
				obj.src = src;
			}
		},
		// 请求下一页
		_getNext: function(index){
			var that = this;
			that.pageObj = $(".flip_page_item").eq(++index);
			var pageObj = $(".flip_page_item").eq(++index),
					imgs = pageObj.find("img"),
					loaded = pageObj.attr("data-loaded"),
					_src;

			if(!loaded || loaded !== undefined && loaded != 1){
				for(var i=0,leng=imgs.length; i<leng; i++){
					_src = imgs.eq(i).data("src");
					if(_src){
						pageflip._setImgSrc(imgs.eq(i)[0], _src);
					}
				}
				pageObj.data("loaded", 1);
				$("#down_arr").show();
			}
		}		
	};

	module.exports = app;
	
});