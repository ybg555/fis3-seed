/**
* @description 制作页 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// 功能模块 · 预加载
	var preload = require('./module/make_init');

	// 功能模块 · 制作海报
	var makePoster = require('./module/to_make');

	// 页面事件		
	var page = {
		init: function(){
			var that = this;
			preload.init();
			makePoster.init();
		},
	};
	page.init();

	

});