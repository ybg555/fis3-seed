/**
 * 拉起九游app --- 九游运营活动
 * @@拉起九游app
 * @author zhicong.czc@alibaba-inc.com
 * @version 1.0.0 ### 20151218
 * @update wuwl ### 20160627
 */
define(function(require, exports, module) {

	/* 本js函数依赖
	 * stat_common.js、ua.js
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
		topullup: function(obj){
			var pkgCh = pullup._getPullupPkgCh();
			var type = pullup._getPullupType(obj);
			var pageId = pullup._getPullupPageId(obj);
			var statName = pullup._getPullupStatName(obj);
			var params = pullup._getPullupParams(obj);
		        	
			stat.Util.h5log("pkgCh:" + pkgCh + ", pageId:" + pageId + ", statName:" + statName + ", params:" + params);
		    pullup._loadApp(type,pkgCh, pageId, statName, params);
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
		 * 获取拉取类型
		 */
		_getPullupType:function(obj){
			var typeDef = "remote";
			var type = $(obj).attr("pullup-type");
			if(type == null || $.trim(type) == ""){
				type = typeDef;
			}
			return type;
		},
		/*
	 * 获取pageId
		 */
    	_getPullupPageId:function(obj){
		    var pageIdDef = typeof(PULLUP_PAGE_ID_DEF) == "number" ? PULLUP_PAGE_ID_DEF:92;
		    var pageId = $(obj).attr("pullup-pageid");
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
		    var pullupStat = $(obj).attr("pullup-stat");
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
		    var paramsStr = $(obj).attr("pullup-params");
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

			/* IOS回馈（9.1版本以前才可获取）
		  */
    	_iosCallback:function(succ, msg){
		    if (succ) {
			    stat.Util.h5log("ios pullup succ");
			    // 发送拉起统计数据
			    var data = "data=position:btn_" + window.statName;
			    stat.Core.safeNonBlockingPullUp(data,"success");
		    } else {
			    stat.Util.h5log("ios pullup fail, msg[" + msg + "]");
			    var data = "data=position:btn_" + window.statName;
			    stat.Core.safeNonBlockingPullUp(data,"fail");
			    if(typeof(customPullUpPop) == "function"){
				    customPullUpPop(JSBridge.pullup.LINK_IOS, msg);
			    }else{
				    window.location.href = JSBridge.pullup.LINK_IOS;
			    }
		    }
    	},
			/* 安卓回馈
		  */
    	_androidCallback:function(error, update, result){
		    if (!error) {
			    stat.Util.h5log("android pullup succ");
			    // 发送拉起统计数据
			    var data = "data=position:btn_" + window.statName;
			    stat.Core.safeNonBlockingPullUp(data,"success");
		    } else {
			    stat.Util.h5log("android pullup fail, update[" + update + "]");
			    // 如果需要更新
			    if (update) {
				    // 发送拉起统计数据
				    var data = "data=position:btn_" + window.statName;
				    stat.Core.safeNonBlockingPullUp(data,"needupdate");
			    } else {
				    // 发送拉起统计数据
				    var data = "data=position:btn_" + window.statName;
				    stat.Core.safeNonBlockingPullUp(data,"needDownload");
			    }
			    if(typeof(customPullUpPop) == "function"){
				    customPullUpPop(result, update);
			    }else{
				    window.location.href = result;
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
		_loadApp:function(type,pkgCh, pageId, statName, params){
			stat.Util.h5log("call JSBridge wakeup, type:" + type + ", pkgCh:" + pkgCh + ", pageId:" + pageId + ", statName:" + statName + ", params:" + params);
			pullup.statName = statName;
			var ps = {"pageId":pageId,"data":params};
			if(type == "live_home_page"){
				ps = {};
			}
			JSBridge.pullup.wakeup({
					type: type,
					action: '',
					apkName: 'ninegame_' + pkgCh + '.apk',
					version: '2.7.0',
					params: ps
				},
				get_ua.isAndroid ? pullup._androidCallback : pullup._iosCallback
			);
		}
	};

	module.exports = pullup;

});