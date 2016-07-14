/**
* @description 划屏翻页
* @author zhengyy3@ucweb.com ### 20150822
* @version 1.0.0
* @dependence: zepto.js
* @update : yingyan.zyy@alibaba-inc.com ### 20151218
* @usage : 
*	flipPage.init({
*		flip : y | x,
*		wrapperObj  : $(flip_page_list),
*		itemsObj    : $(flip_page_item),
*		action      : boolean, 
*		startedFunc : function(){},
*		finishedFunc: function(){}
*	});
*/

define(function(require, exports, module) {
	
	var flipPage = {
		
		init : function(options){
			this.wrapperObj   = options.wrapperObj || {};
			this.itemsObj     = options.itemsObj || {};
			this.action       = options.action || false; //是否有用户自定义方法
			this.flip         = options.flip ? options.flip.toUpperCase() : "Y"; //Y:上下划屏 ; X:左右划屏
			this.startedFunc  = options.startedFunc || function(){};  //切换前执行
			this.finishedFunc = options.finishedFunc || function(){};  //完成后执行
			
			this.maxPageIndex = this.itemsObj.length - 1;
			
			this._events();
		}, 

		_events : function(){
			var that = this;
			
			var startX = 0, startY = 0, endX = 0, endY = 0;
			
			var slide = false, move = false;
			var page = 0;
			
			// 如果是上下划屏就给加上垂直属性
			if ( that.flip === "Y" ) {
				that.wrapperObj.css({
					"-webkit-box-orient":"vertical"
				})
			}

			that.wrapperObj.on("touchstart", function(e){			
				startX = e.touches[0].pageX;
				endX = 0;				
				startY = e.touches[0].pageY;
				endY = 0;
				slide = true;
			});
			that.wrapperObj.on("touchmove", function(e){
				if(slide){
					e.preventDefault();
					endX = e.touches[0].pageX;
					endY = e.touches[0].pageY;
					move = true;
				}
			});
			that.wrapperObj.on("touchend", function(e){
				var absX = Math.abs(endX - startX),
					absY = Math.abs(endY - startY),
					delta = 0;
				
				if(that.flip === "Y" && absY > absX){ //y
					delta = startY - endY;
				}
				else if(that.flip === "X" && absX > absY){ //x
					delta = startX - endX;
				}
				else{
					return;
				}
				
				if(slide && move && (endX || endY)){
					var curPage = that.itemsObj.eq(page),
						nextPage;
					
					if(delta > 0 && page < that.maxPageIndex){	//prev
						++page;
						nextPage = curPage.next();
					}
					else if(delta < 0 && page){             //next
						--page;
						nextPage = curPage.prev();
					}
					else{
						return;
					}

					that.wrapperObj.css({
						"-webkit-transform" : "translate" + that.flip + "(-" + page * 100 + "%)",
						"transform" : "translate" + that.flip + "(-" + page * 100 + "%)",
						"-webkit-transition":"-webkit-transform 800ms ease-in-out",
						"transition":"transform 800ms ease-in-out"
					});
					
					if(that.action){
						that.startedFunc(curPage);
						setTimeout(function(){
							that.finishedFunc(nextPage);
						}, 10);
					}

					slide = false;
					move = false;
				}

			});
		}
	}
	
	module.exports = flipPage;
	
});