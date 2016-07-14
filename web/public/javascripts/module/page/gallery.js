/**
* @description 轮转画廊 
* @author wwl98670@alibaba-inc.com ### 20160601
* @update 
*/

(function($){
  var Gallery = function($el, options) {
    var that = this;
    that.options = $.extend({}, Gallery.defaults, options);
    that.$wrap = $el;
    that.$ul = that.$wrap.find('ul');
    that.$li = that.$ul.find('li');
    that.$prev = that.$wrap.find('.prev');
    that.$next = that.$wrap.find('.next');
    that.$index = that.$wrap.find('.gallery-index');
    that.len = that.$li.length;
    that.init();
  }
  
  Gallery.prototype = {
    init: function() {
      var that = this,
          opt = that.options;
      that.$currentItem = that.$li.eq(opt.currentIndex);

      // 初始化样式
      that.initStyle();

      // 图片小于两张时 跳出
      if (that.len < 2) {
        that.$prev && that.$prev.hide();
        that.$next && that.$next.hide();
        that.$index && that.$index.hide();
        return;
      }

      // 添加当前i
      for (var i = 0; i < that.len; i++) {
        if (i === 0) {
          that.$index.append('<i class="on"></i>');
        } else {
          that.$index.append('<i></i>');
        }
      }

      // 定义上、下一张
      var prevIndex = opt.currentIndex == 0 ? that.len - 1 : opt.currentIndex - 1;

      var nextIndex = opt.currentIndex == that.len - 1 ? 0 : opt.currentIndex + 1;

      that.$prevItem = that.$li.eq(prevIndex);
      that.$nextItem = that.$li.eq(nextIndex);

      // 绑定事件
      that.$wrap.on('touchstart touchmove touchend touchcancel', $.proxy(that.eventHandler, that));

      that.$prev.tap(function() {
        that.prev();
      });

      that.$next.tap(function() {
        that.next();
      });

      opt.autoPlay && that.play();

      // 绑定点击滑坡及即时切换 手机端不需要
      // that.$li.click(function() {
      //   var index = $(this).index();

      //   if (index == prevIndex) {
      //     that.prev();
      //   } else if (index == nextIndex) {
      //     that.next();
      //   }
      // });
      // 
      // $(window).resize(function() {
      //   that.initStyle();
      // });
    },

    // 初始化 （获取自定义opt) 
    prepareStyles: function() {
      var that = this,
          opt = that.options;


      that.currentStyle = {
        'opacity':'1',
        'z-index': 3,
        '-webkit-transform': 'translate3d(0, 0, 0)'
      },

      that.prevStyle = {
        'opacity':'0',
        '-webkit-transform': 'translate3d(-' + opt.translateX + ', 0, 0) scale(' + opt.scale + ')'
      },

      that.nextStyle = {
        'opacity':'0',
        '-webkit-transform': 'translate3d(' + opt.translateX + ', 0, 0) scale(' + opt.scale + ')'
      }

      that.$prevItem.css(that.prevStyle);
      that.$nextItem.css(that.nextStyle);
      that.$currentItem.css(that.currentStyle);
    },

    // 图片初始化
    initStyle: function() {
      var that = this,
          opt = that.options,
          img = that.$li.eq(0).find('img'),
          tempImg = new Image();
      
      tempImg.src = img.attr('src');

      // 获取图片的原始尺寸，实际尺寸不能超过原始尺寸
      tempImg.onload = function() {
                
        var imageWidth = tempImg.width;  

        var winWidth = document.documentElement.clientWidth;

        // 判断是否移动屏，如果超过540了就定死540
        winWidth = Math.min(winWidth, 540);

        // 根据宽高比定height
        var width = Math.min(Math.round(winWidth * opt.zoom), imageWidth) * opt.picscale;
        var height = Math.round(width * opt.rate);

        that.$li.css({
          'width': width,
          'height': height
        });

        that.$ul.css({
          'width': width,
          'height': height
         });

        that.$wrap.css('opacity', 1);
        that.$currentItem.addClass(opt.currentClass);

        if (that.len >= 2) {
          that.prepareStyles();
        }

        opt.initFun();
      };

    },

    // 定义slide
    slide: function() {
      var that = this,
          opt = that.options;

      that.pause();
      that.sliding = true;

      // 初始值
      if (opt.currentIndex == that.len) {
        opt.currentIndex = 0;
      } else if (opt.currentIndex < 0) {
        opt.currentIndex = that.len - 1;
      }

      var prevIndex = opt.currentIndex == 0 ? that.len - 1 : opt.currentIndex - 1;

      var nextIndex = opt.currentIndex == that.len - 1 ? 0 : opt.currentIndex + 1;

      that.$li.each(function(index) {
        var $this = $(this);

        if (index == opt.currentIndex) {
          $this.css({
            'z-index': 3,
            'opacity':1
          }).animate({
            '-webkit-transform': 'translate3d(0, 0, 0) scale(1)'
          }, opt.duration, 'ease-out', function(){
            that.sliding = false;
            that.$index && that.$index.find('i').eq(index).addClass('on').siblings().removeClass('on');

            if (typeof opt.afterSlide == 'function') {
              opt.afterSlide.call(that);
            }

          }).addClass(opt.currentClass).siblings().removeClass(opt.currentClass);

        } else if (index == nextIndex) {
          $this.css({
            'z-index': that.nextZindex
          }).animate(that.nextStyle, opt.duration, 'ease-out');
        } else if (index == prevIndex) {
          $this.css({
            'z-index': that.prevZindex
          }).animate(that.prevStyle, opt.duration, 'ease-out');
        } else {
          $this.css({
            'z-index': 0,
            '-webkit-transform': 'translate3d(0, 0, 0) scale(' + opt.scale + ')'
          });
        }
      });

      opt.autoPlay && that.play();
    },

        /**
         * 事件处理
         */
        eventHandler: function (e) {
            var that = this;

            switch (e.type) {
                case 'touchstart':
                    that.startHandler(e);
                    break;
                case 'touchmove':
                    that.endTimer && clearTimeout(that.endTimer);
                    that.endTimer = setTimeout(function () {
                        that.endHandler();
                    }, 300);
                    that.moveHandler(e);
                    break;
                case 'touchend':
                    break;
                case 'touchcancel':
                    that.endTimer && clearTimeout(that.endTimer);
                    break;
                default:
                    break;
            }
        },

        startHandler: function (e) {
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
        },

        moveHandler: function (e) {
            var movedX = this.startX - e.touches[0].pageX,
                movedY = this.startY - e.touches[0].pageY,
                threshold = this.options.threshold;

            // console.log(movedX, movedY);
            this.isMovePrev = false;
            this.isMoveNext = false;

            if (Math.abs(movedX) >= Math.abs(movedY) && Math.abs(movedY) <= 40) {
                e.preventDefault();
                if (movedX >= threshold) {
                    this.isMoveNext = true;

                } else if (movedX <= ~threshold + 1) {
                    this.isMovePrev = true;
                }
            }
        },

        endHandler: function () {
            if (this.isMoveNext) {
                this.next();
            } else if (this.isMovePrev) {
                this.prev();
            }
        },

        /**
         * 上一张
         */
        prev: function() {
            if (this.sliding) return;

            this.options.currentIndex --;
            this.prevZindex = 1;
            this.nextZindex = 2;
            this.slide();
        },

        /**
         * 下一张
         */
        next: function() {
            if (this.sliding) return;

            this.options.currentIndex ++;
            this.prevZindex = 2;
            this.nextZindex = 1;
            this.slide();
        },

        /**
         * 播放
         */
        play: function() {
            var that = this;

            that.timer = setInterval(function() {
                that.next();
            }, that.options.timeout * 1E3);
        },

        /**
         * 暂停
         */
        pause: function() {
            this.timer && clearInterval(this.timer);
        }
    }

    Gallery.defaults = {
        // {boolean} 是否自动播放
        autoPlay: false,

        // {Percentage} X轴位移
        translateX: '100%',

        // {Float} 图片宽度与窗口宽度的比例
        zoom: 1,

        // {Float} 图片宽高比
        rate: 1.1111111,

        // {Float} 缩放比例
        scale: 0.8,

        // {Integer} 除图片以外其它内容的高度，如标题栏
        // extraHeight: 0,

        // {String} 当前样式
        currentClass: 'focus',

        // {Function} 动画结束后的回调函数
        afterSlide: null,

        // {Integer} 动画执行时间(单位: 毫秒)
        duration: 500,

        // {Integer} 自动播放间隔时间(单位: 秒)
        timeout: 5,

        // {Integer} 当前索引值
        currentIndex: 0,

        // {Integer} 手指滑动的最小距离，仅当手指滑动距离大于或等于该值时才执行切换
        threshold: 20,

        // {Integer} 图片宽度限制 默认为当前屏幕1倍
        picscale: 1



    }

    var func = function ($el, options) {
        return new Gallery($el, options);
    }

    if (typeof define === 'function') {
        define(function(require, exports, module) {
            'use strict';
            return module.exports = func;
        });
    } else {
        window.gallery = gallery = func;
    }

})(Zepto);