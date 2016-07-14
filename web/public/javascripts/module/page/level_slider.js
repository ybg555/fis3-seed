/**
* @description 左右轮播切换
* @author yingyan.zyy@alibaba-inc.com ### 20150827
* @version 1.0.0
* @dependence: zepto.js
* @update yingyan.zyy@alibaba-inc.com ### 20150910 --- 添加划屏/自动轮播支持
*/

define(function(require, exports, module) {
	
	var levelSlider = {
		
		init : function(option){
			var that = this;
			if(!option.wrapperObj.length){
				return;
			}
			//用户自定义
			if(option.ctrlObj){ //左右点击箭头
				that.ctrlObj    = option.ctrlObj || {}; //左右切换按钮
				that.ctrlTag    = option.ctrlTag || option.ctrlObj.children();
				that.ctrlFlag = true;
			}
			else{
				that.ctrlFlag = false;
			}
			
			that.wrapperObj = option.wrapperObj || {};					   
			that.itemsObj   = that.wrapperObj.find(option.itemsObj) || {};	   
			that.w          = option.width || that.wrapperObj.parent().width(); //每次变换的宽度，默认为父级的宽度
			that.duration   = option.duration || 300; //变换速度，默认300ms
			that.autoSlide = option.autoSlide || false; //自动轮播标识
			that.swipe = option.swipe || false; //划屏标识
			that.finishedFunc = option.finishedFunc || function(){};
			
			//初始化
			that.itemsLeng  = that.itemsObj.length || 0;
			that.maxTransX  = that.itemsLeng * (that.w);
			that.curPic     = 0; 
			that.wrapperObj.append(that.itemsObj.eq(0)[0].outerHTML); //在末尾追加第一个元素，用于循环轮播
			that._events();
		},

		_events : function(){
			var that = this;
			
			//点击
			if(that.ctrlFlag){
				that.ctrlObj.delegate(that.ctrlTag, "click", function(){
					if($(this).data("dir") === 1){ //next
						that.turnNext();
					}
					else{ //prev													
						that.turnPrev();
					}
				});
			}
			
			//自动轮播
			var timer;
			if(that.autoSlide){
				timer = setInterval(function(){
					that.turnNext();
				}, 5000);
			}
			
			//划屏
			if(that.swipe){
				var startX = endX = startY = endY = lastTime = 0;

				that.wrapperObj.on({
					touchstart : function(e){
						// e.preventDefault();
						if(timer){
							clearInterval(timer);
						}
						startX = e.touches[0].pageX;
						startY = e.touches[0].pageY;
						
					},
					touchmove : function(e){
						e.preventDefault();
						endX = e.touches[0].pageX;
						endY = e.touches[0].pageY;
					},
					touchend : function(e){
						// e.preventDefault();
						if(Math.abs(endX - startX) < Math.abs(endY - startY)){
							return;
						}
						e.stopPropagation();
						if(that.autoSlide){
							timer = setInterval(function(){
								that.turnNext();
							}, 5000);
						}
						if(!lastTime){
							lastTime = e.timeStamp;
						}
						else if(e.timeStamp - lastTime < that.duration){
							lastTime = e.timeStamp;
							return;
						}
						
						lastTime = e.timeStamp;
						if(startX < endX){
							that.turnPrev();
						}
						else if(startX > endX){
							that.turnNext();
						}
					}
				});
			}
			
		},
		
		turnNext : function(){
			var that = this;
			that.curPic++;
			
			//第0张时需先重置初始位置再做变换
			if(that.curPic === 1){
				that.transToPosition({from:0, to:that.w});
				that.finishedFunc();
				return;
			}
			//最后一张时将位置调整至第0张
			if(that.curPic === that.itemsLeng){
				that.adjustToPosition(0);
			}
			if(that.curPic > that.itemsLeng){
				that.curPic = 1;
			}
			that.transToPosition({to:that.curPic * (that.w)});
			that.finishedFunc();
		},
		
		turnPrev : function(){
			var that = this;
			
			//第0张或最后一张时，需先重置初始位置再做变换
			if(that.curPic === 0 || that.curPic === that.itemsLeng){
				that.curPic = that.itemsLeng - 1;
				that.transToPosition({from:that.maxTransX, to:that.curPic * (that.w)});
				that.finishedFunc();
				return;
			}
			that.curPic--;
			//第0张时将位置调整至末尾
			if(that.curPic === 0){
				that.adjustToPosition(that.maxTransX);
			}
			that.transToPosition({to:that.curPic * (that.w)});
			that.finishedFunc();
		},
		
		/**
		* 调整位置
		* @function
		* @param {number} pos 变换结束后调整为pos
		* @return 
		*/
		adjustToPosition : function(pos){
			var that = this;
			setTimeout(function(){
				that.transForm({x : pos, transition : false});
			}, that.duration);
		},
		
		/**
		* 变换
		* @function
		* @param {json} pos.from 重置初始变换的位置
		* @param {json} pos.to   变换后的位置
		* @return 
		*/
		transToPosition : function(pos){
			var that = this;
			if(pos.from !== undefined){
				that.transForm({x : pos.from, transition : false});
				setTimeout(function(){
					that.transForm({x : pos.to});
				}, 10);
			}
			else{
				that.transForm({x : pos.to});
			}
		},
		
		/**
		* 变换的样式
		* @function
		* @param {json} trans.x translateX的绝对值
		* @param {json} trans.transition  是否需要过渡效果，默认为是，值为false时没有过渡效果
		* @return 
		*/
		transForm : function(trans){
			var that = this,
				_transValue;

			if(trans.transition !== undefined && !trans.transition){
				_transValue = "none";
			}
			else{
				_transValue = "transform " + that.duration + "ms ease-in-out";
			}
			
			that.wrapperObj.css({
				"-webkit-transform" : "translate3d(-" + trans.x + "px, 0, 0)",
				"transform" : "translate3d(-" + trans.x + "px, 0, 0)",
				"-webkit-transition" : "-webkit-" + _transValue,
				"transition" : _transValue,
			});
		}
	}
	
	module.exports = levelSlider;
	
});