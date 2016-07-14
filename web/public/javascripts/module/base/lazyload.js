/**
 * 功能:图片惰性加载。在需要图片惰性加载的页面底部载入。再将图片加上class=“lazy”。并将图片的真实地址放置在图片的自定义属性dataimg中。
 * @author haunghm
 * @version 1.0.0
 * @dependencies jquery 或者 zepto
 */

define(function(require, exports, module) {

var lazyLoad = {
	init: function() {
		var that = this;
		that.img.srcStore      = "dataimg";   //图片真实地址存放的自定义属性
		that.img.class         = "lazy";      //惰性加载的图片需要添加的class
		that.img.sensitivity   = 50;           //该值越小，惰性越强（加载越少）      
		that.img.init();
	},
	img: {
		trigger: function() {
			var that = this;
			eventType = that.isPhone && "touchend" || "scroll";
			that.imglist = $('img.'+that.class+'');
			$(window).trigger(eventType);
			
		},
		init: function() {
			var that = this,
					minScroll = 5,
					slowScrollTime = 200;
			
			$(window).on("scroll", function() {
					that.changeimg()
			});
			
			that.trigger();
			that.isload = !0;
		},
		changeimg: function() {
			function loadYesOrno(img) {
				var windowPageYOffset = window.pageYOffset,
				windowPageYOffsetAddHeight = window.pageYOffset + window.innerHeight,
				imgOffsetTop = img.offset().top;
				return imgOffsetTop >= windowPageYOffset && imgOffsetTop - that.sensitivity <= windowPageYOffsetAddHeight;
			};
			function loadImg(img, index) {
				var imgUrl = img.attr(that.srcStore),
						imgLazy = img.attr("src");
				img.attr("src", imgUrl);
				img[0].onload || (img[0].onload = function() {
					$(this).removeClass(that.class).removeAttr(that.srcStore),
					that.imglist[index] = null,
					this.onerror = this.onload = null
				},
				img[0].onerror = function() {
					this.src = imgLazy,
					$(this).removeClass(that.class).removeAttr(that.srcStore),
					that.imglist[index] = null,
					this.onerror = this.onload = null
				})
			};
			var that = this;
			that.imglist.each(function(index, val) {
				if (!val) return;
				var img = $(val);
				if (!loadYesOrno(img)) return;
				if (!img.attr(that.srcStore)) return;
				loadImg(img, index);
			})
			//that.trigger();
		}
	}
};
	lazyLoad.init();


	var HDreplace = {
		init: function() {
			var that = this;
			that.img();
		},
		img: function(){
			var that = this;
			that.class = "hdpic";
			function loadImg(obj,src){
				var img = new Image();
				img.src = src;
				img.onload = function() {
					obj.src = this.src;
				}
			};
			that.imglist = $('img.'+ that.class + '');
			that.imglist.each(function(){
				var link = $(this).attr('src'),
					dotLink = link.split("."),
					name = link.split('.'+dotLink[dotLink.length-1])[0];
				loadImg(this,name+'_big.'+dotLink[dotLink.length-1]);
			});
		}
	};
	HDreplace.init();


	module.exports = {
		setInit : function() {
			lazyLoad.init();
		}
	}
	
});