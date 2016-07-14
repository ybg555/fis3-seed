/**
* @description 滑动模块 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/


define(function(require, exports, module) {

	var app = {
		init:function(){
				var slip = require('../../../../cmdmodule/page/slip');
				var $getobj = $("#slideUL");

				//初始化
				var oBigBanner = $('#slideUL'),
						len = $('#slideUL').find("li").length;
		
				//大banner 调用
				doSlip(oBigBanner[0], len);
		
				//相同banner模型
				function doSlip(obj, n){

					var oUl = obj.querySelector('ul');
					var aLi = obj.querySelectorAll('li');
					
					var oP = obj.querySelectorAll('#slideUlIndex')[0];
					if (n <= 1) {
						oP.innerHTML = "";
					} else {
						var oPhtml = "<i class='on'></i>";
						for(var i =1;i<n;i++) {
							oPhtml += "<i></i>";
						}
						oP.innerHTML = oPhtml;
					}

					var aBigI = obj.querySelectorAll('i');

					var iLiWidth =  aLi[0].offsetWidth;

					for(var i =0;i<aLi.length;i++) {
						aLi[i].style.width = iLiWidth + 'px';
					}

					oUl.style.width = iLiWidth + 'px';

					//结束执行回调
					function fnEnd(){
						for(var i=0; i < aBigI.length; i++)
						{
							if(i==this.page)
							{
								aBigI[i].className = 'on';
							}else{
								aBigI[i].className = '';
							}
						}
					}		
					slip('page',oUl,{
						num: n,
						parent_wide_high:iLiWidth,
						endFun: fnEnd
					});
				}
			}
	}

	module.exports = app;

	
});