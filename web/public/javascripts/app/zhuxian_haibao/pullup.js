/**
* @description 拉起 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {

	var _method = require('../../../cmdmodule/sku/_method'),
			_pop_method = _method.popFn;
	// 页面事件		
	var app = {
		init: function(){
			var that = this;
			$("#toPullup").tap(function(){
				_method.toclick({
					obj:$(this),
					callback: function(){


					}
				})
			})
		},
	};

	app.init();


});