/**
 * @description 制作页 -- 诛仙海报
 * @author wwl98670@alibaba-inc.com ### 20160603
 * @update
 */
define(function(require) {

	//基础方法定义
	(function() {
		var requestAnimationFrame =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

		window.requestAnimationFrame = requestAnimationFrame;

		var cancelAnimationFrame =
			window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			clearTimeout;
		window.cancelAnimationFrame = cancelAnimationFrame;

	})();

	var tool = {
		//设置css
		setCss: function(obj,data){
			for (x in data) {
				obj.style[x]=data[x];
			}
		},

		//取番位内随机数
		getRandomNum: function(Min, Max){
			var Range = Max - Min;
			var Rand = Math.random();
			return parseInt(Min + Math.round(Rand * Range));
		},

		//解决canvas绘制模糊问题
		getRatio: function(canvas){
			var ctx = canvas.getContext("2d");
			var devicePixelRatio = window.devicePixelRatio || 1;
			var backingStorePixelRatio =
				ctx.webkitBackingStorePixelRatio ||
				ctx.mozBackingStorePixelRatio ||
				ctx.msBackingStorePixelRatio ||
				ctx.backingStorePixelRatio || 1;
			return devicePixelRatio / backingStorePixelRatio;
		},

		//粒子轨迹算法
		update: function(opt){
			var angle = opt.angle,
				mp = opt.mp,
				particles = opt.particles,
				W = opt.W,
				H = opt.H;
			angle += 0.02;

			for(var i = 0; i < mp; i++) {

				var p = particles[i];
				p.y += Math.cos(angle+p.d) + 1 + p.r/10;
				p.x += Math.sin(angle) * 1;


				//兼容屏幕边缘
				//如果粒子的位置已经不再是视窗里了
				if( p.x > W+5 || p.x < -5 || p.y > H) {

					if(i%3 > 0) {
						particles[i] = {
							x: Math.random()*W,
							y: -10,
							r: p.r,
							d: p.d
						};
					}

					else {
						//If the flake is exitting from the right
						if(Math.sin(angle) > 0)	{
							//Enter from the left
							particles[i] = {
								x: -5,
								y: Math.random()*H,
								r: p.r,
								d: p.d
							};
						}

						else {
							//Enter from the right
							particles[i] = {
								x: W + 5,
								y: Math.random() * H,
								r: p.r,
								d: p.d
							};
						}
					}
				}
			}
		},

	};


	var app = {
		init: function () {
			var that = this;
			that.getDom();
			that.preload();
		},
		getDom: function () {
			var that = this;
			that.con = $('#canvasCon');
			that.canvas = $('#canvas');
			that.param = $('#canvasParam');

			that.lock = 1;
		},

		//预加载
		preload: function () {
			var that = this;
			var count = 0;
			for (var i = 0; i < sources.length; i++) {
				+function (i) {
					var img = new Image();
					img.onload = function () {
						count++;
						if (count >= sources.length) {
							setTimeout(function () {
								that.toCanvas();
								that.bindEvent();
							}, 50);
						}
					}
					img.src = sources[i];
				}(i)
			}
		},

		//绑定事件
		bindEvent: function(){
			var that = this;
			// app.con[0].addEventListener('touchmove', function (e) {
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// }, false);
		},

		//canvas那些事儿
		toCanvas: function () {
			var that = this;
			var con = app.con[0],
				canvas = app.canvas[0],
				ctx = canvas.getContext("2d");



			//canvas dimensions
			var W = $('#container').width(),
				 H = 400;


			canvas.width =  W;
			canvas.height = H;

			tool.setCss(con, {
				'height': H+'px'
			});

			//飘花儿
			app.flowersDraw({
				ctx: ctx,
				canvas: canvas,
				W: W,
				H: H
			});

		},

		//飘花
		flowersDraw: function(opt){
			var ctx = opt.ctx,
				canvas = opt.canvas,
				W = opt.W,
				H = opt.H;

			//用一个数组保存所有flower的图片
			var flowers = [],
				imgroot = app.param.data("imgroot");
			for (var i = 1; i <=20; i++) {
				var im = new Image();
				im.src = imgroot + 'f' + i  + '.png';
				flowers[i] = im;
			}


			//用一个数组长度为mp的数组保存粒子的所有状态,包括初始位置x,y,图片序号r, 以及d
			// 以后每个粒子的初始化都从这5个状态中选1个
			var mp = 5,
				particles = [];
			for(var i = 0; i < mp; i++) {
				particles.push({
					x: Math.floor( Math.random()*W ), //x-coordinate
					y: Math.floor( Math.random()*H ), //y-coordinate
					r: tool.getRandomNum(1,20), //随机选择的flower的序号
					d: Math.random()*mp //density
				})
			}

			//开花
			requestAnimationFrame(flower);

			//花开不败
			function flower(){
				try {
					//经过刷新频率的时间, 擦掉canvas, 然后重绘
					ctx.clearRect(0, 0, W, H);
					for (var i = 0; i < mp; i++) {
						var p = particles[i];  //选择一个粒子状态
						var hua = flowers[p.r],
							huaW = hua.width / 2,
							huaH = hua.height / 2;

						//ctx.drawImage(imgsrc, x,y,width,height)
						ctx.drawImage(hua, p.x, p.y, huaW, huaH);
					}

					// ctx.drawImage(canvas, 0, 0);

				} catch (e) {
					app.con[0].style.display = 'none';
					app.lock = 0;
				}

				//
				tool.update({
					angle: 1,
					mp: 5,
					particles: particles,
					W: W,
					H: H
				});

				//除非被关闭了要不就一直开一直开开开
				if ( app.lock ) {
					requestAnimationFrame(flower);
				}
			}

		},

	};

	if ( $("#canvasCon").length > 0 ) {
		app.init();
	}

});