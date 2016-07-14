/**
 * @description 验证流程
 * @author wwl98670@alibaba-inc.com
 * @version 1.0
 * @dependence:
 * @update
 */

define(function(require, exports, module) {

	var _method = require('../../../../cmdmodule/sku/_method');
	_pop_method = _method.popFn;


	var app = {
		init: function(){
			var that = this;
			that._getDom();
			that.checkMobile();
			that.sendAjax();
		},
		_getDom: function(){
			var that = this;
			that.reg_mobile = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/; //手机号格式
			that.reg_ckcode = /^[A-Za-z0-9]{4}$/; //图形验证码格式
			that.reg_code = /^\d{5}$/; //短信验证码格式

			that.sendBtn = $("#sendMobile");
			that.param = $("#verifyParam");

		},

		// 获取手机验证码
		checkMobile: function(){
			var that = this;

			// 监听手机号输入
			$("#inputMobie input").on("input propertychange", function(){
				if ( _method.checkreg(app.reg_mobile,this.value) == 1 ) {
					that.sendBtn.attr("lock",0).addClass("get_smscode");
					$("#inputMobie").removeClass("is-err");
					app.checkSmscode();
				} else {
					that.sendBtn.attr("lock",1);
					if ( this.value.length == 11 ) {
						$("#inputMobie .botmsg").html("请输入正确的手机号码");
						$("#inputMobie").addClass("is-err");
					}

				}
			});

			// 监听图形验证码输入
			$("#capCode input").on("input propertychange", function(){
				if ( _method.checkreg(app.reg_ckcode,this.value) == 1 ) {
					that.sendBtn.attr("lock",0).addClass("get_smscode");

				} else {
					that.sendBtn.attr("lock",1);
				}
			});

			// 绑定发送获取验证码请求
			$("#verifyPhone").on("click",".get_smscode", function(){
				if ( $(this).attr("cdt") != 1 ) {
					_method.toclick({
						obj:$(this),
						callback:that.toSend
					})
				}
			});

		},

		// 监听短信验证码输入
		checkSmscode: function(){
			var that = this;
			var reg = that.reg_code;
			var $smsLine = $("#inputSms"),
				$smsMsg = $smsLine.find(".botmsg");

			$("#inputSms input").on("input propertychange", function(){
				if ( _method.checkreg(reg,this.value) == 1 ) {
					$smsLine.removeClass("is-err");
					$("#sendAjax").addClass("send_ajax").removeAttr("lock");
				} else {
					$smsMsg.html("请输入正确的验证码");
					$smsLine.addClass("is-err");
					$("#sendAjax").removeClass("send_ajax").attr("lock",1);
				}
			});
		},

		// 获取短信验证码
		toSend: function(arg){
			var that = this;
			var obj = arg.obj,
				c = app.param.attr("data-c"),
				activeId = $("#pageParam").attr("data-activeid"),
				mobile = $.trim($(".get_infos[name='mobile']").val()),
				reg = app.reg_mobile,
				surl,
				json;

			if ( _method.checkreg(reg,mobile) == 1 ) {

				//如果是从图形验证码跳过来的,则要带上图形验证码参数
				if ( obj.attr("hascapt") && obj.attr("hascapt") == 1 ) {
					var captcha = $("#capCode input").val();
					surl  = app.param.attr("data-capurl");
					json = {mobile:mobile,c:c,captcha:captcha,activeId:activeId};
				}
					
				//如果是直接跳进来的
				else {
					var ua = UA_Opt.getUA();
					surl = app.param.attr("data-smsurl");
					json = {mobile:mobile,c:c,ua:ua,activeId:activeId};
				}

				$.ajax({
					type: "GET",
					url: surl,
					data: json,
					datatype:"json",
					timeout:6000,
					beforeSend: function(){
						_method.lockbtn(obj);
					},
					success: function(response){
						if ( response.state && response.state.code ) {
							var code = response.state.code;
							if ( code == 2000000 ){
								if ( response.data && response.data.hasCommit == 1 ) {
									_pop_method.msgpop({lock:2,msgarr:["该手机号已经预约过了",],btnarr:['确定'],callback:function(){}})
									_pop_method.addpopclose();
									_pop_method.refreshpop();
								}
								else {
									app.toCD(obj);
								}
							}
							else if ( code == 5005002 ){
								app._showCaptcha();
							}
							else{
								_pop_method.errpop({lock:2,msgarr:["状态异常,请稍后再试"],btnarr:['关闭'],callback:function(){}})
								_pop_method.addpopclose();
								_pop_method.refreshpop();
							}
						}
						else {
							_pop_method.errpop({lock:0,msgarr:["预约失败,请稍后再试"],btnarr:['关闭'],callback:function(){}})
							_pop_method.addpopclose();
						}
					},
					error: function(xhr){
						_pop_method.errpop({lock:0,msgarr:["网络出错,请稍后再试"],btnarr:['关闭'],callback:function(){}})
						_pop_method.addpopclose();
					}
				});
			}
			else {
				_pop_method.errpop({lock:0,msgarr:["手机号码格式有误,请稍后再试"],btnarr:['关闭'],callback:function(){}})
				_pop_method.addpopclose();
			}
		},

		// 进入读条
		toCD: function(obj){
			var that = this;
			app._hideCaptcha();
			app._cdt(obj);
		},
		_cdt: function(obj){
			var that = this;
			var seconds = 60,
				handle;
			obj.html('重新获取(<i>'+seconds+'</i>秒)').attr({
				"lock":1,
				"cdt":1
			});
			var clock = obj.find("i");
			function timer() {
				seconds -= 1;
				clock.html(seconds);
				if ( seconds == 0 ) {
					stopTimer();
					obj.attr('lock','0');
					obj.attr('cdt','0');
				}
			}
			function startTimer() {
				handle = setInterval(timer,1000);
			}
			function stopTimer() {
				clearInterval(handle);
				obj.html("获取验证码").removeAttr("lock,cdt");
			}
			startTimer();
		},

		// 展示图形验证码
		_showCaptcha: function(){
			var that = this;
			$("#capCode input").val('');
			$("#capCode").show();
			$("#inputSms").hide();
			app.sendBtn.attr("hascapt",1);
			var getsrc = $.trim($(".code-check").attr("data-src"));
			$(".code-check").attr("src",getsrc + new Date().getTime());
			$("#sendAjax").removeClass("send_ajax").attr("lock",1);
		},
		// 隐藏图形验证码
		_hideCaptcha: function(){
			var that = this;
			$("#inputSms input").val('');
			$("#capCode").hide();
			$("#inputSms").show();
			app.sendBtn.removeAttr("hascapt");
		},
		// 进入出错流程
		toErr: function(arg){
			var that = this;
			_method.unlockbtn(arg.obj);
			_pop_method.msgpop({lock:2,msgarr:["出错了"],btnarr:['确定'],callback:function(){}})
			_pop_method.addpopclose();
			_pop_method.refreshpop();
		},

		// 发送数据请求
		sendAjax: function(){
			var that = this;
			$(".bookBtnWraper").on("click",".send_ajax", function(){

				var activeId = $("#pageParam").attr("data-activeid");
				var mobile = $(".get_infos[name='mobile']").val(),
					captcha = $(".get_infos[name='captcha']").val();

				if ( _method.checkreg(app.reg_mobile,mobile) == 1 && _method.checkreg(app.reg_code,captcha) == 1 ) {

					var json = {},
						obj = $(this),
						len = $(".get_infos").length,
						result = 0;
					// 封装json
					for ( var i=0; i<len; i++) {
						var key = $(".get_infos").eq(i).attr("name"),
							val = $(".get_infos").eq(i).val();

						if ( typeof val == 'undefined' || val == null || val == '' ) {
							result = 0;
							break;
						} else {
							result = 1;
							json[key] = val;
						}
					};

					json.activeId = activeId;
					json.content = "yy";

					if ( result == 1 ) {
						app.toCommit(obj,json);
					} else {
						_pop_method.errpop({
							msgarr:['还没有输入完整哦~']
						});
					}
				} else {
					_pop_method.errpop({
						msgarr:['手机号和验证码输入了么~']
					});
				}
			});
		},
		// 终极提交
		toCommit: function(obj,json){
			var that = this;

			$.ajax({
				type: "POST",
				url: app.param.attr("data-surl"),
				data: json,
				datatype:"json",
				timeout:6000,
				beforeSend: function(){
					_method.lockbtn(obj);
				},
				success: function(response){
					_method.unlockbtn(obj);
					if ( response && response.state && response.state.code ) {
						var code = response.state.code;
						if ( code == 2000000 ) {

							_pop_method.msgpop({lock:2,msgarr:["预约成功!",],btnarr:['确定'],callback:function(){}})
							_pop_method.addpopclose();
							_pop_method.refreshpop();
							$('.bookBtn').addClass('success');
						}
						else {
							_pop_method.errpop({lock:0,msgarr:["预约失败,请稍后再试"],btnarr:['关闭'],callback:function(){}})
							_pop_method.addpopclose();
						}
					}
					else {
						_pop_method.errpop({lock:0,msgarr:["未知错误,请稍后再试"],btnarr:['关闭'],callback:function(){}})
						_pop_method.addpopclose();

					}
				},
				error: function(xhr){
					_pop_method.errpop({lock:0,msgarr:["网络状况不佳,请稍后再试"],btnarr:['关闭'],callback:function(){}})
					_pop_method.addpopclose();
				}
			});

		}

	}

	module.exports = app;

});