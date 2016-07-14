/**
 * 通用方法 --- 九游活动系统
 * @@通用拉起方法
 * @author zhicong.czc@alibaba-inc.com
 * @version 1.0.0 ### 20151218
 * @update 
 */
define(function(require, exports, module) {
	/* 本js部分函数依赖stat_common.js
	 * 拉起公共参数配置
	 * PULLUP_PKGCH_DEF 页面定义默认渠道号
	 * PULLUP_PKGCH_ARR 页面定义渠道号范围限制
	 * PULLUP_PAGE_ID_DEF 页面定义默认pageId
	 * PULLUP_STAT_DEF 页面定义默认统计参数名
	 * PULLUP_PARAMS_DEF 页面定义默认拉起参数
	 * customPullUpPopWechat 自定义微信弹窗函数
	 * customPullUpPop 自定义弹窗函数
	 */
	var pullup = {
		isIos : function(){
			var ua = navigator.userAgent;
			return !!ua.match(/(iPad|iPhone|iPod)/i);
		},
		isAndroid : function(){
			var ua = navigator.userAgent;
			return !!ua.match(/Android/i);
		},
		isWebchat : function(){
			var ua = navigator.userAgent;
			return !!ua.match(/MicroMessenger/i);
		},
		isUc : function(){
			var ua = navigator.userAgent;
			return !!ua.match(/UCBrowser/i);
		},
		isUcsdk : function(){
			var ua = navigator.userAgent;
			return !!ua.match(/ucsdk/i);
		},
		isNG : function(pf){
			var ua = navigator.userAgent;
			if(pf) {
				if(pf == 0) {
					return !!ua.match(/ninegameclient\/android/i);
				} else{
					return !!ua.match(/ninegameclient\/ios/i);
				}
			} else {
				return !!ua.match(/ninegameclient/i);
			}
		},
		pullup: function(obj){
			// 微信
			if(pullup.isWebchat()){
				if(typeof(customPullUpPopWechat) == "function"){
		      		customPullUpPopWechat();
		           	return;
		       	}
			}				
			var pkgCh = pullup._getPullupPkgCh();			            
		    var pageId = pullup._getPullupPageId(obj);			        	
		    var statName = pullup._getPullupStatName(obj);	        	
		    var params = pullup._getPullupParams(obj);	
		        	
		    stat.Util.h5log("pkgCh:" + pkgCh + ", pageId:" + pageId + ", statName:" + statName + ", params:" + params);
		    pullup._loadApp(pkgCh, pageId, statName, params);
		},
		/* 
		 * 获取渠道号
    	 */ 
		_getPullupPkgCh:function(){
    		var pkgChDef = typeof(PULLUP_PKGCH_DEF) == "string" ? PULLUP_PKGCH_DEF:"KD_128";
    		var pkgCh = stat.Util.getPkgCh();
            if (!pkgCh) {
            	pkgCh = pkgChDef;
        	}else{
        		var pkgChArr = (typeof(PULLUP_PKGCH_ARR) == "object" && (PULLUP_PKGCH_ARR instanceof Array)) ? PULLUP_PKGCH_ARR:[];
        		if(pkgChArr.length > 0){
        			var ix = -1;
            		for(var i = 0;i < pkgChArr.length;i ++){
            			if(pkgChArr[i] == pkgCh){
            				ix = i;
            				break;
            			}
            		}
            		if(ix < 0){
            			pkgCh = pkgChDef;
            		}
        		}
        	}
            return pkgCh;
    	},
    	/* 
		 * 获取pageId
    	 */
    	_getPullupPageId:function(obj){
    		var pageIdDef = typeof(PULLUP_PAGE_ID_DEF) == "number" ? PULLUP_PAGE_ID_DEF:92;
    		var pageId = $(obj).attr("pullup_pageid");
        	try{
        		pageId = parseInt(pageId);
        		if(isNaN(pageId) || pageId <= 0){
        			pageId = pageIdDef;
        		}
        	}catch(e){
        		stat.Util.h5log("get pullupPageId excep, attr pageid:" + pageId);
        		pageId = pageIdDef;
        	}
        	return pageId;
    	},
    	/* 
    	 * 获取拉起统计参数名
    	 */
    	_getPullupStatName:function(obj){
    		var pullupStatDef = typeof(PULLUP_STAT_DEF) == "string" ? PULLUP_STAT_DEF:"stat";
    		var pullupStat = $(obj).attr("pullup_stat");
    		if(!pullupStat){
    			pullupStat = pullupStatDef;
    		}
        	return pullupStat;
    	},
    	/* 获取拉起参数
    	 */
    	_getPullupParams:function(obj){
    		var pullupParamsDef = (typeof(PULLUP_PARAMS_DEF) == "object" && !(PULLUP_PARAMS_DEF instanceof Array)) ? PULLUP_PARAMS_DEF:{};
    		var params = pullupParamsDef;
        	var paramsStr = $(obj).attr("pullup_params");
        	if(paramsStr && paramsStr != ""){
        		try{
    	        	var arr = paramsStr.split("\|");
    	        	for(var i = 0;i < arr.length;i++){
    	        		var pv = arr[i].split("\=");
    	        		params[pv[0]] = pv[1];
    	        	}
        		}catch(e){
        			stat.Util.h5log("get pullupParams excep, attr params:" + paramsStr);
        			params = pullupParamsDef;
        		}
        	}
        	return params;
    	},
    	_iosCallback:function(succ, msg){
    		if (succ) {
    			stat.Util.h5log("ios pullup succ");
				// 发送拉起统计数据
				var data = "data=position:btn_" + pullup.statName + "_pullupios|pkgCh=" + stat.Util.getPkgCh() + "|pullresult:success";
				stat.Core.safeNonBlockingPullUp(data);
			} else {
				stat.Util.h5log("ios pullup fail, msg[" + msg + "]");
				var data = "data:position:btn_" + pullup.statName + "_pullupfail|pkgCh=" + stat.Util.getPkgCh() + "|pullresult:fail";
				stat.Core.safeNonBlockingPullUp(data);
				if(typeof(customPullUpPop) == "function"){
					customPullUpPop(JSBridge.pullup.LINK_IOS, msg);
				}else{
					window.location.href = JSBridge.pullup.LINK_IOS;
				}
			}
    	},
    	_androidCallback:function(error, update, result){
			if (!error) {
				stat.Util.h5log("android pullup succ");
				// 发送拉起统计数据
				var data = "data=position:btn_" + pullup.statName + "_pullup|pkgCh=" + stat.Util.getPkgCh() + "|pullresult:success";
				stat.Core.safeNonBlockingPullUp(data);
			} else {
				stat.Util.h5log("android pullup fail");
				// 如果需要更新
				if (update) {
					// 发送拉起统计数据
					var data = "data:position:btn_" + pullup.statName + "_update|pkgCh=" + stat.Util.getPkgCh() + "|pullresult:needupdate";
					stat.Core.safeNonBlockingPullUp(data);
				} else {
					// 发送拉起统计数据
					var data = "data=position:btn_" + pullup.statName + "_download|pkgCh=" + stat.Util.getPkgCh() + "|pullresult:needDownload";
					stat.Core.safeNonBlockingPullUp(data);
				}
				if(typeof(customPullUpPop) == "function"){
					customPullUpPop(result, update);
				}else{
					console.log(result);
					//window.location.href = result;
				}				
			}
    	},
		/**
		 * 端外拉起九游APP.支持IOS(appStore链接已写死).
		 * @param pkgCh 抛包渠道号
		 * @param pageId 拉起后的页面的pageId
		 * @param statName 统计参数
		 * @param params 传递参数
		 */
		_loadApp:function(pkgCh, pageId, statName, params){
			stat.Util.h5log("call JSBridge wakeup");
			pullup.statName = statName;	
			JSBridge.pullup.wakeup({
					type: 'remote',
					action: '',
					apkName: 'ninegame_' + pkgCh + '.apk',
					version: '2.7.0',
					params: {
						pageId: pageId,
						data: params
					}
				},
				pullup.isAndroid()?pullup._androidCallback:pullup._iosCallback
			);
		}
	};
	module.exports = {
		isIos: pullup.isIos,
		isAndroid: pullup.isAndroid,
		isWebchat: pullup.isWebchat,
		isUc: pullup.isUc,
		isUcsdk: pullup.isUcsdk,
		isNG: pullup.isNG,
		pullup: pullup.pullup
	};	
});