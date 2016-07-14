/**
* @description 预约页 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	// 功能模块 · 预加载
	var preload = require('./module/order_init');

	// 功能模块 · 验证手机
	var verify = require('../../../cmdmodule/sku/verify');

	// 页面事件		
	var app = {
		init: function(){
			var that = this;
			preload.init();
			verify.init();
		},
	};

	app.init();


});