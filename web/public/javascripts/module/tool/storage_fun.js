/**
* 根据localStorage执行事件 --- 通用事件 --- 九游活动系统
* @author wuwl@ucweb.com ### 20150513
* @update wuwl
*/

define(function(require, exports, module) {
	
	var storageFun = {
		init: function(arg){
			var that = this;
			that.getObj      			= arg.getObj;                         //触发事件
			that.keyname      		= arg.keyname || "storagekey";        //存储键值
			that.ifkeyname        = arg.ifkeyname || "storagehas";      //是否存储键值
			that.initialFun       = arg.initialFun;                     //初始化函数
			that.returnFun        = arg.returnFun;                      //返回函数
			that.triggerFun       = arg.triggerFun; 	                  //触发事件函数
			that.feedbackFun      = arg.feedbackFun; 	                  //回馈事件函数
			
			that._checkStorage();
			that._recordStorage();
		},
		_checkStorage: function() {
			var that = this;
			that.getObj.each(function() {
				that.storagekey = $(this).data(that.keyname);
				that.ifrecorded = localStorage.getItem(that.storagekey);
				if ( that.ifrecorded == null ) {
					that.initialFun();
				} else {
					that.returnFun();
				}
			});
		},
		_recordStorage: function() {
			var that = this;		
			that.getObj.tap(function() {
				that.storagekey = $(this).data(that.keyname);
				that.storagehas = $(this).data(that.ifkeyname);
				if ( that.storagehas == 0 ) {
					localStorage.setItem(that.storagekey,1);	
					$(this).data(that.ifkeyname,1);
					that.triggerFun();
				}  else if ( that.storagehas == 1 ) {
					that.feedbackFun();
				}
			});	
		}
	}
	
	module.exports = storageFun;
	
});