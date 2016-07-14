/**
* 滑动图集控件 --- 九游安卓门户
* @author wwl98670@alibaba-inc.com
* @version 1.0.0 ### 20160413
* @update 
* @depend  ../page/slip 滑动控件
*/ 
define(function(require, exports, module) {

	// 调用slip方法
	var _slipFn = require('../../../../cmdmodule/page/slip.js');
	
	// 传参
	var app = {
		init: function(arg){
			var that = this;
			that.wrap = arg.wrap || $("#slidePic");
			that.ul = arg.ul || that.wrap.find(".ul");
			that.li = arg.li || that.ul.find(".li"); 
			that.speed = arg.wrap.attr("data-speed") || 0;
			that.len = that.li.length;
			
			if ( that.len > 1 ) {
				that.setWidth();
				that.setIndicator();
				that.toslide();
			}
		},
		
		setWidth: function(){
			var that = this;
			var li_width = that.li.width();
			that.li.width(li_width);
			that.ul.width(li_width*that.len);
			
		},
		
		setIndicator: function(){
			var that = this;
			var indicator = that.wrap.find(".indicator"),
					type = indicator.attr("data-type") || "dot";
			if ( type == 'dot' ) {
				var oPhtml = "<i class='on'></i>";
				for ( var i =1; i<that.len; i++ ) {
					oPhtml += "<i></i>";
				}
				indicator.html(oPhtml);
			} else {
				var oPhtml = "<i class='on'>1</i>";
				for ( var i = 1; i< that.len ; i++ ) {
					var n = i+1;
					oPhtml += "<i>"+ n +"</i>";
				}
				indicator.html(oPhtml);
			}
		},
		toslide: function(){
			var that = this;
			var oFirstImg = that.ul.find("img")[0],
					oNewFirstImg = new Image(),
					oDot = that.wrap.find(".indicator").find("i");
			oNewFirstImg.src = oFirstImg.getAttribute("src");
			oNewFirstImg.onload = _slipFn('page', that.ul[0], {
				direction: "x",
				no_bar : false,
				endFun: fnEnd,
				num : that.len,
				change_time: that.speed
			});
			function fnEnd(){
				oDot.removeClass("on").eq(this.page).addClass("on");
			}
		}
	}
	
	module.exports = app;

});