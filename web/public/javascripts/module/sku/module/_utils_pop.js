/**
 * 基础弹窗方法 --- 阿里游戏
 * @author wwl98670@alibaba-inc.com  
 * @version 1.0.0 ### 20151129
 * @update wuwl ### 20160229 for 封装方法
 */
define(function(require, exports, module) {
	
	var app = {
		/**
		 * 事件：显示指定的弹窗
		 * @param {object} arg
		 * @param {string} [arg.popup] 选择器，指明弹窗所在的大容器,弹出时会将相邻弹窗窗口进行关闭， 默认就是"#utilsPop"
		 * @param {string} arg.obj 选择器，指明要弹出的那个弹窗
		 * @param {string|number} [arg.lock] 锁的类型: (默认)0-不对背景上锁，点击任何.pop_close弹框都消失; 1-对背景上锁，点击背景，弹框不会消失; 2-点击任何.pop_close都会刷新当前页面.
		 * @param {function} [arg.callback] 弹窗出现后立即调用的回调函数
		*/
		showpop: function(arg){
			var that = this;
			that.popup = arg.popup || "#utilsPop"; 
			that.obj = arg.obj;
			that.lock = arg.lock || "0"; 
			
			if ( that.lock == "0" ) { //解锁窗口
				app.unlockpop();
			} else if ( that.lock == "1" ) { //锁定窗口
				app.lockpop();
			} else if ( that.lock == "2" ) { //强制刷新
				app.refreshpop();
			}

			$(that.popup).show().siblings('.utils-popup').hide();
			$(that.obj).show().siblings().hide();
			
			if ( arg.callback && arg.callback instanceof Function ) {
				arg.callback();
			}
		},
		
		/**
		 * 事件：关闭指定的弹窗
		 * @param {string} object 选择器，指明需要关闭的弹窗（直接隐藏其父级pop框）
		*/
		closepop: function(obj){
			$(obj).parents(".utils-popup").hide();
		},
		
		/**
		 * 定义方法：在弹窗内写入内容, 此方法可以生成文字提示或者按钮
			* @param {object} arg
		  * @param {string} [arg.box] 选择器，指明写入数据的部分，默认就是"#pop_msg .text-content"（即通用文字提示部分）
		  * @param {arr} [arg.arr] 定义写入内容数组
		*/
		writepop: function(arg) {
			var that = this;
			that.box = arg.box || "#pop_msg .text-content";
			that.arr = arg.arr;
			that.len = that.arr.length;
			that.html = [];
			that.count = 0;
			for ( var i=0; i<that.len; i++ ) {
				var item = "<div class='item'>"+that.arr[i]+"</div>";
				that.html.push(item);
				that.count++;
				if ( that.count == that.len ) {
					that.html = that.html.join("");
					$(that.box).html(that.html);
				}
			}
		},
		
		/**
		 * 组件：拉起通用msg弹窗
		 * @param {object} arg
		 * @param {string|number} [arg.lock] 锁定蒙版开关，开关指数见showpop方法
		 * @param {arr} [arg.msgarr] 提示文字数组
		 * @param {arr} [arg.btnarr] 按钮内容数组
		 * @param {function} [arg.callback] 回调函数
		*/
		msgpop: function(arg){
			var that = this;
			that.lock = arg.lock || "0";
			that.callback = arg.callback || function(){};
			if ( arg.msgarr ) {
				app.writepop({
					arr:arg.msgarr
				});
			}; 
			if ( arg.btnarr ) {
				app.writepop({
					box:"#pop_msg .button-content",
					arr:arg.btnarr
				});
			};

			app.showpop({
				obj:"#pop_msg",
				lock:that.lock,
				callback:that.callback
			});
		},
		
		/**
		 * 定义方法：在弹窗内写入内容, 此方法可以生成其他自定义属性
			* @param {object} arg
		  * @param {string} [arg.box] 选择器，指明写入数据的部分，默认就是"#pop_msg .oth-content"（即通用文字提示部分）
		  * @param {arr} [arg.arr] 定义写入内容数组
		*/
		othpop: function(arg) {
			var that = this;
			var box = arg.box || "#pop_oth",
					html = arg.html || '我是自定义内容',
					lock = arg.lock || 0,
					callback = arg.callback || function(){};
			$(box).html(html);
			app.showpop({
				obj:box,
				lock:lock,
				callback:callback
			});
		},

		/**
		 * 组件：拉起通用报错弹窗 
		 * @param {object} arg
		 * @param {arr} [arg.msgarr] 通用报错提示，可自定义
		 * @param {arr} [arg.btnarr] 通用按钮提示文字，默认为一个按钮 ['我知道了']
		 * @param {string|number} [arg.statBoxId] 统计id 默认为2
		 * @param {function} [arg.callback] 回调函数 默认为加上弹窗关闭事件
		*/
		errpop: function(arg){
			var that = this;
			var msgarr = arg.msgarr || ['连接失败了呢，请检查下网络哦~'],
					btnarr = arg.btnarr || ['我知道了'],
					callback = arg.callback || function(){app.addpopclose()};
			app.msgpop({
				msgarr:msgarr,
				btnarr:btnarr,
				callback:callback
			});
		},
		
		/**
		 * 组件：拉起loading弹窗并将蒙版锁定
		*/
		loadpop: function(msg){
			var that = this;
			var msg = msg || "请求中，请稍候……"
			$("#pop_load .in_msg").html(msg);
			app.showpop({
				obj:"#pop_load",
				lock:1
			})
		},
		
		
		/**
		 * 工具：锁定弹窗关闭
		*/
		lockpop: function(){
			var that = this;
			$(".pop_close").each(function(){
				$(this).attr("lock","1");
			})
		},
		
		/**
		 * 工具：解锁弹窗
		*/
		unlockpop: function(){
			var that = this;
			$(".pop_close").each(function(){
				$(this).attr("lock","0");
			})
		},
		
		/**
		 * 工具：触发弹窗强制刷新功能
		*/
		refreshpop: function(){
			var that = this;
			$(".pop_close").each(function(){
				$(this).attr("lock","2");
			})
		},
		
		/**
		 * 工具：为当前弹窗加上关闭事件
		 * @param {string} object 选择器，默认为弹窗上的第一个（左边）按钮
		*/
		addpopclose: function(obj){
			var that = this;
			that.obj = obj || $("#pop_msg .button-content .item");
			that.obj.addClass("pop_close").attr("lock","0");
		},

		/**
		 * 绑定：基础监听
		*/
		bindEvent: function(){
			var that = this;
			/**
			 * 绑定pop_close关闭功能
			*/
			$(".utils-popup").on("click",".pop_close",function(){
				var lock = $(this).attr("lock"),
						parent = $(this).parents(".utils-popup");
				if ( lock == 0 ) {
					setTimeout(function(){
						parent.hide();
					},50);
				} else if ( lock == 2 ) {
					var ua = window.navigator.userAgent.toLowerCase();
    			if( ua.match(/MicroMessenger/i) == 'micromessenger' ) {
    				var d = new Date(),
    						d = d.getTime();
    				window.location.href = window.location.href + "?d=" + d;
    			} else {
    				window.location.reload(true);
    			}
					
				} else {
					return;
				}
			});
			/**
			 * 禁用pop蒙版滑动
			*/
			$(".utils-popup").on("touchmove",".pop-maskbg,.pop-container,.pop-inbox",function(e){
				e.preventDefault(); 
				e.stopPropagation(); 
			});
		}
		
	};
	
	
	// 传递接口
	module.exports = app;

});