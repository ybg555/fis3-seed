/**
 * 统计方法 --- 九游运营活动
 * @author wwl98670@alibaba-inc.com
 * @version 1.0.0 ### 20151129
 * @update wuwl ### 20160229 for 封装方法
 */
define(function(require) {

	var stat = stat || {};
	stat.Cookie = stat.Cookie || {
		/**
		 * 默认cookie域名
		 */
		DEFAULT_DOMAIN: ".9game.cn",
		/**
		 * 默认cookie路径
		 */
		DEFAULT_PATH: "/",
	    /**
		 * 验证字符串是否合法的cookie键名
		 *
		 * @param {string}
		 *            source 需要验证的key
		 * @return {bool} 是否合法的cookie键名
		 */
	    _isValidKey: function(key) {
	        return new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key);
	    },
	    /**
		 * 获取cookie的值，不对值进行解码
		 *
		 * @function
		 * @param {string}
		 *            key 需要获取Cookie的键名
		 *
		 * @returns {string|null} 获取的Cookie值，获取不到时返回null
		 */
	    getRaw: function(key) {
	        if (cookie._isValidKey(key)) {
	            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"),
	            result = reg.exec(document.cookie);
	            if (result) {
	                return result[2] || null;
	            }
	        }
	        return null;
	    },
	    /**
		 * 获取cookie的值，用decodeURIComponent进行解码
		 *
		 * @function
		 * @param {string}
		 *            key 需要获取Cookie的键名
		 * @description <b>注意：</b>该方法会对cookie值进行decodeURIComponent解码。如果想获得cookie源字符串，请使用getRaw方法。
		 *
		 * @returns {string|null} cookie的值，获取不到时返回null
		 */
	    get: function(key) {
	        var value = cookie.getRaw(key);
	        if ("string" == typeof value) {
	            value = decodeURIComponent(value);
	            return value;
	        }
	        return null;
	    },
	    /**
		 * 设置cookie的值，不对值进行编码
		 *
		 * @function
		 * @param {string}
		 *            key 需要设置Cookie的键名
		 * @param {string}
		 *            value 需要设置Cookie的值
		 * @param {Object}
		 *            [options] 设置Cookie的其他可选参数
		 * @config {string} [path] cookie路径
		 * @config {Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
		 * @config {string} [domain] cookie域名
		 * @config {string} [secure] cookie是否安全传输
		 */
	    setRaw: function(key, value, options) {
	        if (!cookie._isValidKey(key)) {
	            return;
	        }

	        options = options || {};

	        // 计算cookie过期时间
	        var expires = options.expires;
	        if ('number' == typeof(expires)) {
	            expires = new Date();
	            expires.setTime(expires.getTime() + options.expires);
	        }
	        var domain = options.domain;
	        if('string' != typeof(domain)){
	          options.domain = this.DEFAULT_DOMAIN;
	        }
	        var path = options.path;
	        if('string' != typeof(path)){
	          options.path = this.DEFAULT_PATH;
	        }
	        var ck = key + "=" + value + (options.path ? "; path=" + options.path: "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain: "") + (options.secure ? "; secure": '');
	        // stat.Util.h5log("set cookie:" + ck);
	        document.cookie = ck;
	    },
	    /**
		 * 设置cookie的值，用encodeURIComponent进行编码
		 *
		 * @function
		 * @param {string}
		 *            key 需要设置Cookie的键名
		 * @param {string}
		 *            value 需要设置Cookie的值
		 * @param {Object}
		 *            [options] 设置Cookie的其他可选参数
		 * @config {string} [path] cookie路径
		 * @config {Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
		 * @config {string} [domain] cookie域名
		 * @config {string} [secure] cookie是否安全传输
		 */
	    set: function(key, value, options) {
	        cookie.setRaw(key, encodeURIComponent(value), options);
	    },
	    /**
		 * 删除cookie的值
		 *
		 * @function
		 * @param {string}
		 *            key 需要删除Cookie的键名
		 * @param {Object}
		 *            options 需要删除的cookie对应的 path domain 等值
		 */
	    remove: function(key, options) {
	      value = this.get(key);
	        options = options || {};
	        options.expires = new Date();
	        options.expires.setTime(options.expires.getTime() - 3600 * 1000);
	        //stat.Util.h5log("remove cookie key[" + key + "], value[" + value + "], expires[" + options.expires + "]");
	        cookie.setRaw(key, value, options);
	    }
	};

	stat.Util = stat.Util || {
	/**
	 * 页面底部增加日志输出，方便h5页面调试
	 * window.STAT_H5LOG_ENABLED=true 打开日志
	 */
    h5log: function(msg) {
    	console.log(msg);
    	if(typeof(window.STAT_H5LOG_ENABLED) == "boolean" && window.STAT_H5LOG_ENABLED){
    		if($("#h5PageConsole").size() <= 0){
    			$("body").append('<div id="h5PageConsole"></div>');
    		}
    		$("#h5PageConsole").append("<p>" + msg + "</p>");
    	}
    },
    /**
	 * 版本号比较 
	 */
    compareVer: function(ver1,ver2){
		if(!ver1 || typeof(ver1) != "string"){
			return -1;
		}
		if(!ver2 || typeof(ver2) != "string"){
			return 1;
		}
		ver1 =  ver1.replace(/\./g,"");
		ver2 =  ver2.replace(/\./g,"");
		var l1 = ver1.length;
		var l2 = ver2.length;		
		if ( l1 > l2 ) {
			for ( var i = 0; i < l1 - l2; i++ ) {
				ver2 = ver2 + '0';			
			}
		} else if(l1 < l2){
			for ( var i = 0; i < l1 - l2; i++ ) {
				ver1 = ver1 + '0';			
			}
		}
		ver1 = parseInt(ver1);
		ver2 = parseInt(ver2);
		if ( ver1 >  ver2 ) {
			return 1;
		} else if(ver1 < ver2){
			return -1;
		} else {
			return 0;
		}
	},
    /**
	 * 封装eventlisteneer，ie：attachEvent，others：addEventListener
	 */
    addEventListener: function(a, b, c, d) {
        try {
            a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c);
        } catch(e) {}
    },
    /**
	 * 是否支持事件
	 */
    isSupportDocumentEvent: function(event) {
        return ("on" + event) in window;
    },
    /**
	 * 判断是不是SDK壳
	 */
    isSdkWrap: function() {
        return - 1 != navigator.userAgent.indexOf("ucsdk");
    },
    /**
	 * 判断是不是客户端壳，默认android
	 */
    isClientWrap: function(platform) {
    	if(typeof(platform) == "undefined"){
    		platform = "android";
    	}
    	var ua = navigator.userAgent;
		var ng = "NineGameClient";
		if(platform != ""){
			ng += "/" + platform;
		}
    	var ngi = ua.indexOf(ng);
        return ngi >= 0;
    },    
    /**
	 * 设置缓存数据
	 */
    put: function(key, value, cacheOnly) {
        if (key && value) {
            if (window.localStorage) {
                window.localStorage.setItem(key, value);
            }
            if(!cacheOnly){
            	stat.Cookie.set(key, value);
            }
        }
    },
    /**
	 * 读取缓存数据数据
	 */
    get: function(key, cacheOnly) {
        if (!key) {
            return null;
        }
        var value;
        if (window.localStorage) {
            value = window.localStorage.getItem(key);
        }
        if (!value && !cacheOnly) {
            value = stat.Cookie.get(key);
        }
        return value;
    },
    /**
	 * 删除缓存数据
	 */
    remove: function(key, cacheOnly) {
        if (key) {
            if (window.localStorage) {
                window.localStorage.removeItem(key);
            } else {
            	if(!cacheOnly){
            		stat.Cookie.remove(key);
            	}
            }
        }
    },
    /**
	 * 获取url请求参数
	 */
    getUrlParam : function(name) {
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null)
    		return unescape(r[2]);
    	return null;
    },
    /**
	 * 获取推广渠道
	 */
    getCFrom: function() {
        var cfrom = this.getUrlParam("cfrom");

        // 如果url中获取不到，则从cookie中获取
        if (cfrom == null) {
        	cfrom = this.get("cfrom");
        }
        if (cfrom) {
            return cfrom;
        }
        return "";
    },
    /**
	 * 获取游戏抛包渠道
	 */
    getGameCh: function() {
        var gameCh = this.getUrlParam("gameCh");

        // 如果url中获取不到，则从cookie中获取
        if (gameCh == null) {
        	gameCh = this.get("gameCh");
        }
        if (gameCh) {
            return gameCh;
        }
        return "";
    },
    /**
	 * 获取APP抛包渠道
	 */
    getPkgCh: function() {
        var pkgCh = this.getUrlParam("pkgCh");

        // 如果url中获取不到，则从cookie中获取
        if (pkgCh == null) {
            pkgCh = this.get("pkgCh");
        }
        if (pkgCh) {
            return pkgCh;
        }
        return "";
    },
    /**
	 * 获取pageId
	 */
    getPageId: function() {
        var pageId = this.getUrlParam("pageId");

        // 如果url中获取不到，则从cookie中获取
        if (pageId == null) {
            pageId = this.get("pageId");
        }
        if (!pageId) {
            return '0';
        }
        return pageId;
    },
    tryRecoverHuuid: function(){
    	var huuid = this.get("huuid", true);
    	if(!huuid){
    		huuid = stat.Cookie.get("huuid");
    		if(huuid){
    			this.put("huuid", huuid);
    		}
    	}else{
    		stat.Cookie.set("huuid", huuid);
    	}
    }
};

	stat.Core = stat.Core || {};

	(function(sdk) {
    core = sdk.Core;
    util = sdk.Util;
    cookie = sdk.Cookie;

    /**
	 * 点击
	 */
    var SERVICE_CLICK = "/stat?action=click";
    /**
	 * 下载
	 */
    var SERVICE_DOWN = "/stat?action=down";
    /**
	 * 拉起
	 */
    var SERVICE_PULLUP = "/stat?action=pullup";
    /**
	 * 访问
	 */
    var SERVICE_VISIT = "/stat?action=visit";
    /**
	 * 需要统计的元素name属性
	 */
    var ACT_STAT_NAME = "uc_act_adm";
    /**
	 * act统计属性名称,position
	 */
    var ACT_STAT_ATTRIBUTE = "act_stat";
    /**
	 * act统计属性名称,down game
	 */
    var ACT_STAT_DOWN_GAME = "act_stat_dg";

    /**
	 * ---------------------------------------------------------------------------------------------------------------------------- |
	 * new Image()是一个没有引用的临时变量，随时可能被浏览器的垃圾回收机制回收。 |
	 * 如果这个图片的HTTP请求尚未建立，那么在被回收时这个请求就会被取消，导致打点并没有真正发出。 |
	 * 如果打点所在的页面比较复杂，浏览器垃圾回收机制可能会被频繁触发，那么这种方式打点的丢失率可能会高达10%以上。 |
	 * 解决方法很简单，将这个图片赋值给一个全局变量即可 |
	 * -----------------------------------------------------------------------------------------------------------------------------
	 */
    core.BASE_URL = "";
    
    /**
     * window.STAT_VISIT_LOG object 额外的统计参数
     * 如：{
     * 	"activeId":4150,
     * 	"sceneId":1254
     * }
     */
    core.OTHER_STAT = "";
	    
    /**
	 * 点击日志
	 */
    core.safeNonBlockingClick = function(data) {
    	data += "|a1:|a2:|a3:";
        core.safeNonBlockingStat(SERVICE_CLICK, data);
    };
    /**
	 * 点击日志
	 */
    core.safeNonBlockingDown = function(data,gameId) {
    	data += "|a1:yx|a2:" + (!!gameId?gameId:"") + "|a3:";
        core.safeNonBlockingStat(SERVICE_DOWN, data);
    };
    /**
	 * 拉起日志
	 */
    core.safeNonBlockingPullUp = function(data, pr) {
    	data += "|a1:" + (!!pr?pr:"") + "|a2:|a3:";
        core.safeNonBlockingStat(SERVICE_PULLUP, data);
    };
    /**
	 * 访问日志
	 */
    core.safeNonBlockingVisit = function(data) {
    	data += "|a1:|a2:|a3:";
        core.safeNonBlockingStat(SERVICE_VISIT, data);
    };
    /**
	 * 安全模式，非阻塞点击响应事件，通过设置image.src。
	 * 
	 * @param url
	 *            跳转链接地址
	 * @see <a
	 *      href="http://oldj.net/article/one-thing-to-notice-about-new-image/">使用NEW
	 *      IMAGE()打点时的一个注意事项</a>
	 */
    core.safeNonBlockingStat = function(service, data, callback) {
    	// 渠道参数
    	data += "|cfrom:" + util.getCFrom() + "|pkgCh:" + util.getPkgCh() + "|gameCh:" + util.getGameCh();
    	  	
    	data += core.OTHER_STAT;
    	
    	var url = encodeURIComponent(window.location.href);
    	data += "|url:" + url;
    	// 访问日志，传递refer参数
    	if(SERVICE_VISIT == service){
    		var refer = encodeURIComponent(document.referrer);
    		data += "|refer:" + refer;
    	}
    	
        var randomIndex = Math.random();
        // 添加随机数，避免浏览器因缓冲后退页面导致该部分数据没有统计
        var url = core.BASE_URL + service + "&id=" + randomIndex + "&" + data;

        // image打点
        var img = new Image(1, 1);
        // 用一个windows变量保存，避免GC
        // 这里会产生两个img对象，局部和全局，可能会产生两个请求
        // window[randomIndex] = img;

        // 对a标签，延迟跳转
        window["alf"] = false;
        // 全局变量引用
        img.onload = img.onerror = img.onloadstart = function() {
            // window[randomIndex] = null;
            if (callback && typeof(callback) == "function") {
                callback();
            }
            window["alf"] = true;
            img = null;
            console.log("stat succ:" + url);
        };
        img.src = url;
    };
    /**
	 * 通过element name添加事件监听
	 * 
	 * @param adMaterielName
	 *            元素名称
	 */
    core.addActClickListener = function() {
        $("body").on("click", '.' + ACT_STAT_NAME + ', [name="' + ACT_STAT_NAME + '"]',
        		function() {
        			var position = $(this).attr(ACT_STAT_ATTRIBUTE);
        			if (position) {
        				var downGame = $(this).attr(ACT_STAT_DOWN_GAME);
        				if(!downGame){// 普通点击
        					var stats = "data=position:" + position;
            				core.safeNonBlockingClick(stats);
            			}else{ // 下载点击
            				var stats = "data=position:" + position;
            				core.safeNonBlockingDown(stats,downGame);
            			}
        				
        				var eo = $(this)[0], href = "";
        				while (document != eo && eo) {
        					if (eo.getAttribute("href") && eo.tagName.toLowerCase() == "a") {
        		            	href = eo.getAttribute("href");
        		            	break;
        		        	}
        		            eo = eo.parentNode;
        		        }
        		        if (href.length > 1) {
        		        	var t = 80;
							var tv = 80;
							var go = function() {
								if (window["alf"]) {
									console.log("alf ok:" + window.location.href);
									window.location.href = href;
								} else {
									t += tv;
									// console.log("alf false, t[" + t + "]");
									if (t >= 400) {
										console.log("alf over time, t[" + t + "]");
										window.location.href = href;
									} else {
										setTimeout(go, tv);
									}
								}
							};
							setTimeout(go, t);
							return false;
						}
        			}
        });
    };
    /**
	 * 获取客户端登录ucid
	 */
    core.getAccountInfo = function() {
    	var rsp = {};
    	if (util.isClientWrap("")) {
        	// 查询账号信息
            rsp = JSBridge.callNative('NineGameClient', 'getAccountInfo');
            if(typeof(rsp) == "string"){
            	rsp = JSON.parse(rsp || '{}');
            }
        }
    	return rsp;
    };
    /**
	 * 客户端登录
	 */
    core.isAppLogin = function(synCookie) {
    	// ios 低于2.2.09版本默认登录，返回true
    	if (util.isClientWrap("ios")){
    		var ver = JSBridge.callNative('NineGameClient', 'getEnv', {key:'apk_version'});
    		if(util.compareVer(ver,"2.2.0.9") < 0){
    			return true;
    		}    		
    	}
    	var isLogin = false;
        // APP端
        if (util.isClientWrap("")) {
        	// 查询账号信息
            var rsp = core.getAccountInfo();
            if (rsp && rsp.data && (rsp.data.ucid > 0)) {
            	isLogin = true;
            	if(synCookie){
					cookie.set("ucid",rsp.data.ucid);
					stat.Util.h5log("isAppLogin nickName:" + rsp.data.nickName);
					if (rsp.data.nickName) {
						cookie.set("nickName",rsp.data.nickName);
	                } else {
	                    cookie.set("nickName","九游玩家" + rsp.data.ucid);
	                }
                }
            }else{            	
            	if(synCookie){
            		//开发模式下把这几行注释，方便以cookie开发
					//cookie.remove("ucid");
					//cookie.remove("nickName");
                }
            }
        }
        stat.Util.h5log("isAppLogin:" + isLogin + ",synCookie:" + synCookie);
        return isLogin;
    };
    /**
	 * 客户端登录
	 */
    core.appLogin = function(refresh) {
        // 如果客户端
        if (util.isClientWrap("")) {
        	try {
        		JSBridge.callNative("NineGameClient", "login", 
            			{
            				"loginInfo": {
            					"type": "floatview",
            					"tag": "subscribeGift",
            					"title": "登录送福利",
            					"content": "",
            					"account": "",
            					"accountType": "uc"
            				}
            			},
            			function(rsp) {
            				stat.Util.h5log("login callback rsp:" + rsp);
            				if (rsp.result) {
            					// 登录成功
            					if(rsp.data && rsp.data.code && rsp.data.code == 1) {
            						cookie.set("ucid",rsp.data.ucid);
            						if (rsp.data.nickname) {
            							cookie.set("nickName",rsp.data.nickname);
            		                } else {
            		                    cookie.set("nickName","九游玩家" + rsp.data.ucid);
            		                }
            						if(typeof(refresh) == "undefined" || refresh){
                						window.location.reload(true);
                					}
            					}            					
            				} else {
            					stat.Util.h5log("login fail:" + rsp.msg);
            				}
            		});
        	} catch (e) {
				stat.Util.h5log("error:" + e);
			}
        }
    };
    /**
	 * 初始化，同步APP端的登录态
	 * window.STAT_INIT_LOGIN 是否需要页面进入就弹登录框
	 */
    core.init = function() {
    	// 渠道参数
    	var cfrom = util.getUrlParam("cfrom");
    	var pkgCh = util.getUrlParam("pkgCh");
    	var gameCh = util.getUrlParam("gameCh");
    	// 更新cookie
    	if(cfrom != "" && cfrom != util.get("cfrom")){
			util.put("cfrom",cfrom);
		}
		if(pkgCh != "" && pkgCh != util.get("pkgCh")){
			util.put("pkgCh",pkgCh);
		}
		if(gameCh != "" && gameCh != util.get("gameCh")){
			util.put("gameCh",gameCh);
		}
    	// 初始化其他统计参数
    	if(typeof(window.STAT_VISIT_LOG) == "object"){
    		for(var f in window.STAT_VISIT_LOG){
    			core.OTHER_STAT += "|" + f + ":" + window.STAT_VISIT_LOG[f];
    		}
    	}
        // 客户端同步登录态，并登录
        if (util.isClientWrap("")) {
        	var uuid = JSBridge.callNative('NineGameClient', 'getEnv', {key:'uuid'})
        	var imei = JSBridge.callNative('NineGameClient', 'getEnv', {key:'imei'});
        	var mac = JSBridge.callNative('NineGameClient', 'getEnv', {key:'mac'});
        	if(uuid) {
          		cookie.set("uuid",uuid);
          	}
          	if(imei) {
          		cookie.set("imei",imei);
          	}
          	if(mac) {
          		cookie.set("mac",mac);
          	}
          	var fp = cookie.get("fingerprint");
    		if(!fp && typeof(Fingerprint) != "undefined"){
    			fp = new Fingerprint({canvas: true, screen_resolution: true}).get();
    			cookie.set("fingerprint", fp);
    		}
    		stat.Util.tryRecoverHuuid();
    		var huuid = cookie.get("huuid");
          	// stat.Util.h5log("uuid[" + uuid + "],imei[" + imei + "],mac[" + mac + "],fp[" + fp + "],huuid[" + huuid + "]");
        	if (!core.isAppLogin(true)) {
                if(typeof(window.STAT_INIT_LOGIN) == "undefined" || window.STAT_INIT_LOGIN){
		                  core.appLogin();
		              }
		            }
		        }
		    };
		    /**
		     * 发送访问统计请求
			 */
		    core.sendVisit = function() {
		        // 如果是SDK的话，调用SDK的H5接口获取SDK gameId
		        if (util.isSdkWrap()) {
		          if("undefined" != typeof(sdkBase)){
		            stat.Util.h5log("sdkBase loaded, bridgeready");
			          document.addEventListener("bridgeready",
			              function() {
			                        var sdkB = new sdkBase();
			                        var gameInfo = sdkB.request(sdkB.servType.COMMON, sdkB.actions.GET_GAME_INFO);
			                        util.put("sdkGameId", gameInfo.data.gameId);
			                        var data = "data=pageId:" + util.getPageId();
			                        core.safeNonBlockingVisit(data);
			          });
		          }else{
		            stat.Util.h5log("sdkBase js not load, can't get sdkGameId");
		            var data = "data=pageId:" + util.getPageId();
		                core.safeNonBlockingVisit(data);
		          }
		        } else {
		            var data = "data=pageId:" + util.getPageId();
		            core.safeNonBlockingVisit(data);
		        }
		    };
		    /**
			 * 初始化拉起操作，每个页面可能需要拉起的内容不一样
			 */
		    core.initPullUp = function() {
		      if(typeof(customPullUp) == "function"){
		        customPullUp();
		      }
		    };

		    /**
			 * 加载
			 */
		    core.load = function() {
		        /** 0.初始化 */
		        core.init();
		        /** 1.增加点击监听事件 */
		        core.addActClickListener();
		        /** 2.发送访问统计数据 */
		        core.sendVisit();
		        /** 3.初始化拉起函数 */
		        core.initPullUp();
		    };
		})(stat);

	//绑定全局事件
	window.stat = stat;

	//页面加载后进行统计
	$(function(){
		stat.Core.load();
	});

});