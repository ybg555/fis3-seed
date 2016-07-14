/**
* 默认下拉加载 --- 通用事件 --- 九游安卓门户
* @author huanghm@ucweb.com
* @version ### 20131212
* @description 下拉到底部加载事件
* @update wuwl ### 20141121
*/
define(function(require, exports, module) {

	var scrollBottomLoad = {
	
		init: function(arg) {		
			var that = this;
			that.requestIng = false;
			that.data = arg.data;
			that.url  = arg.url;
			that.type = arg.type || "GET";
			that._getDom(arg);
			if(that.container.size() == 0){
				return;	
			}
			that._getFun(arg);
			that.initFun();
			that._bind();
			$(window).trigger("scroll");
		},
		
		_getDom: function(arg){
			var that = this;
			var doc = document;
			that.container         = $("#"+arg.containerId); //异步包裹容器
			that.loadingTipObj     = $("#"+arg.loadingTipObjId); //加载更多展示容器
			that.loadingTipHtml    = that.loadingTipObj.html(); //默认加载更多容器里内容
			that.loadErrorTipHtml  = $("#"+arg.loadErrorTipObjId).html(); //加载失败内容
		    that.loadMoreTipHtml   = $("#"+arg.loadMoreTipObjId).html(); //点击加载更多内容
		    that.noMoreTipHtml     = $("#"+arg.noMoreTipObjId).html(); //加载结束内容
			that.loadParentBoxId   = $("#"+arg.loadParentBoxId); //加载更多展示容器外壳
			that.list_loading      = $(".list_loading"); //加载更多展示容器外壳
			that.loadif            = that.list_loading.length; //是否存在list_loading
		},
		
		_getFun: function(arg){
			var that = this;
			that.initFun           = arg.initFun  || function(){};
			that.startFun          = arg.startFun || function(){};
			that.errorFun          = arg.errorFun || function(){};
			that.endFun            = arg.endFun   || function(){};
		},
		
		_bind: function(){
			var that = this;
			that._bindScroll();
			ai.touchClick(that.loadingTipObj[0],function(){
				that._request();
			});
		},
		
		_bindScroll: function(){
			var that = this;
			$(window).bind('scroll', function() {
				
				if( $(window).scrollTop() >= $(document).height() - $(window).height() - 253) {
					that._request();
				}
			});
		},
		
		_request :function(){
			var that = this;
			if( that.requestIng == false){
				that._ajax();	
			}
		},
		
		_render: function(data){
			var that = this;
			that.container.append(data);
			$(window).trigger("scroll");
		},
		
		_beforeSendFun: function(){
			var that = this;
			that.requestIng = true;
			that.loadingTipObj.html(that.loadingTipHtml);
			that.startFun();
		},
		
		_successFun: function(data){
			
			var that = this;
			that.requestIng = false;
			var continueTo = that.endFun(data);
			if ( continueTo == "noMore" ) { //已全部加载结束没有更多
				$(window).unbind('scroll');
				that.loadingTipObj.html(that.noMoreTipHtml);
				that._hideload();
			} else if ( continueTo == "clickMore" ) { //点击加载更多
				$(window).unbind('scroll');
				that._render(data);
				that.loadingTipObj.html(that.loadMoreTipHtml);
			} else if (continueTo == "resumeAutoLoad") { //继续自动加载
				that._bindScroll();
				that._render(data);
				that.loadingTipObj.html(that.loadingTipHtml);
			} else if ( continueTo == "againRequest" ) { //重复加载
				$(window).trigger("scroll");
				that.loadingTipObj.html(that.loadingTipHtml);
			}  else if (continueTo == "temporarilyNoMore") { //一直加载到结束
				that.loadingTipObj.html(that.noMoreTipHtml);
	      $(window).unbind('scroll');
				that.times = setTimeout(function(){
					that.loadParentBoxId.hide();
	      },3000);
			} else {
				that._render(data);
				that.loadingTipObj.html(that.loadingTipHtml);
			}
			
		},
		
		_errorFun: function() {
			var that = this;
			that.requestIng = false;
			that.errorFun();
			that.loadingTipObj.html(that.loadErrorTipHtml);
		},
		
		_showload: function() {
			var that = this;
			if ( that.loadif > 0 ) {
				that.list_loading.show();
				that.list_loading.find("#loadingTip").show();
			}
		},
		
		_hideload: function() {
			var that = this;
			if ( that.loadif > 0 ) {
				that.times = setTimeout(function(){
					that.list_loading.hide();
	      },1000);
			}
		},
		
		_ajax: function(){
			var that = this;
			$.ajax({
				      type: that.type,
				       url: that.url,
				      data: that.data,
				   timeout: 4000,
				beforeSend: function(){
					that._beforeSendFun();
					that._showload();
					
				},
				success: function(data){
					that._successFun(data);
					that._showload();
				},
				error: function(){
					that._errorFun();
				}
			});
		},
		
		setData: function(data){
			var that = this;
			that.data = data;	
		},
		
		setUrl: function(url){
			var that = this;
			that.url = url;	
		}
		
	}
	
	module.exports  = scrollBottomLoad;

});






