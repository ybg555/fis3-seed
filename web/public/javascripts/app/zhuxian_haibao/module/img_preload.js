/**
* @description 图片加载 
* @author yingyan.zyy@alibaba-inc.com ### 20150821
* @version 1.0.2
* @dependence: zepto.js
* @update wuwl ### 修复bgsrc替换bug
*	imgPreload.init({
*		element : $(object),
*		loadingFunc : function(){
*			//读取中事件
*		},
*		finishedFunc : function(){
*			//结束事件
*		}
*	});
*/
define(function(require, exports, module) {
	
	var imgPreload = {
		
		/**
		* @property 加载进度 0~1 
		* @type number 
		*/
		completePercent : 0,
		
		/**
		* 获取需要加载的图片
		* @function
		* @param
		* @return {Array} 数组
		*/
		getImgSrc : function(){
			var that = this,
				total = that.element.length,
				picObj, bgStr, imgArr = [];
			for(var i=0; i<total; i++){
				picObj = that.element.eq(i);
				if(picObj[0].tagName === "IMG"){
					imgArr.push(picObj.attr("src"));
				} else {
					bgStr = picObj.css("background-image");
					if( bgStr !== "none" ){
						imgArr.push(bgStr.match(/\([^\)]+\)/g)[0].replace(/\(("|')?|("|')?\)/g, ""));
					}
				}
			}
			return imgArr;
		},
		
		/**
		* 加载
		* @function
		* @param 
		* @return 
		*/
		_events : function(){
			var that = this,
				imgArr = that.getImgSrc(),
				imgLeng = imgArr.length,
				count = 0;

			for(var i=0; i<imgLeng; i++){
				(function(k){
					var img = new Image();
					img.src = imgArr[k];
					if( img.complete ){
						_loading(++count, imgLeng);
					} else {
						img.onerror = img.onload = function(){
							_loading(++count, imgLeng);
						}
					}
				})(i);
			}
			
			function _loading(current, total){
				that.completePercent = current / total;
				that.loadingFunc();
				// console.log(current);
				// console.log(total);
				// console.log(that.completePercent);
				if(current === total){
					that.finishedFunc();
					return;
				}
			}
		},
		
		init : function(option){
			this.element = option.element || {};                      //需要加载的元素
			this.loadingFunc = option.loadingFunc || function(){};	  //加载过程中执行
			this.finishedFunc = option.finishedFunc || function(){};  //加载完成后执行
			this._events();
		}
	}
	
	module.exports = imgPreload;
	
});