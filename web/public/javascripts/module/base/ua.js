/**
 * 判断UA -- 基础组件
 * @author wwl98670@alibaba-inc.com
 * @version 1.0.0 ### 20151218
 * @update wuwl
 */

define(function (require) {

	window.get_ua = (function(){
		var ua = navigator.userAgent;
		return {
			isUA: ua,
			isWechat : !!ua.match(/MicroMessenger/i),
			isQQ: !!ua.match(/QQ/i),
			isUC : !!ua.match(/UCBrowser/i),
			isIos : !!ua.match(/(iPad|iPhone|iPod)/i),
			isAndroid : !!ua.match(/Android/i),
			isUcsdk : !!ua.match(/ucsdk/i),
			isNG: !!ua.match(/ninegameclient/i),
			isNGios: !!ua.match(/ninegameclient\/ios/i),
			isNGandroid: !!ua.match(/ninegameclient\/android/i),
		}
	})();

	console.info('blade')
	return {
		name: 'blade'
	}

});