/**
* @description 制作页 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

if ( $("#canvasCon").length > 0 ) {
	window.onload = function(){
		//工具组件
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
					if( p.x > W+5 || p.x < -5 || p.y > H) {
						//66.67% of the flakes
						if(i%3 > 0) {
							particles[i] = {
								x: Math.random()*W,
								y: -10,
								r: p.r,
								d: p.d
							};
						}	else {
							//If the flake is exitting from the right
							if(Math.sin(angle) > 0)	{
								//Enter from the left
								particles[i] = {
									x: -5,
									y: Math.random()*H,
									r: p.r,
									d: p.d
								};
							} else {
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
				that.close = $('#cv_close')

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
				app.close.on("tap",function(){
					app.con.hide();
					app.lock = 0;
				});
				tool.setCss(app.close[0], {
					'opacity': 1
				});
				app.con[0].addEventListener('touchmove', function (e) {
					e.stopPropagation();
					e.preventDefault();
				}, false);
			},

			//canvas那些事儿
			toCanvas: function () {
				var that = this;
				var con = app.con[0],
					canvas = app.canvas[0],
					ctx = canvas.getContext("2d");

				//canvas dimensions
				var W = window.innerWidth,
					H = window.innerHeight;

				canvas.width =  W;
				canvas.height = H;

				tool.setCss(con, {
					'height': H + 'px'
				});

				//飘花儿
				app.flowersDraw({
					ctx: ctx,
					canvas: canvas,
					W: W,
					H: H
				});

				//碧池出现
				app.moveInDraw({
					canvas: canvas,
					ctx: ctx,
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

				//种花
				var flowers = [],
					imgroot = app.param.data("imgroot");
				for (var i = 0; i < 10; i++) {
					var im = new Image();
					im.src = imgroot + 'f' + (i + 5) + '.png';
					flowers[i] = im;
				}

				//撒种子
				var mp = 5,
					particles = [];
				for(var i = 0; i < mp; i++) {
					particles.push({
						x: Math.floor( Math.random()*W ), //x-coordinate
						y: Math.floor( Math.random()*H ), //y-coordinate
						r: tool.getRandomNum(5,14), //radius
						d: Math.random()*mp //density
					})
				}

				//开花
				requestAnimationFrame(flower);

				//花开不败
				function flower(){
					try {
						ctx.clearRect(0, 0, W, H);
						for (var i = 0; i < mp; i++) {
							var p = particles[i];
							var hua = flowers[p.r-5],
								huaW = hua.width / 2,
								huaH = hua.height / 2;
							ctx.drawImage(hua, p.x, p.y, huaW, huaH);
						}

						ctx.drawImage(canvas, 0, 0);

					} catch (e) {
						app.con[0].style.display = 'none';
						app.lock = 0;
					}

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

			//人物出现动画
			moveInDraw: function (opt){
				//生成canvas层
				var canvas = opt.canvas,
					ctx = opt.ctx,
					canvasIn = document.createElement("canvas"),
					canvasAdd = document.createElement("canvas");

				canvasIn.id = 'canvasRole';
				canvasAdd.id = 'canvasHair';
				app.con[0].appendChild(canvasIn);
				app.con[0].appendChild(canvasAdd);

				//canvas size
				var canvasIn = $("#canvasRole")[0],
					ctxIn = canvasIn.getContext("2d"),
					ctxAdd = canvasAdd.getContext("2d");

				var ratio = tool.getRatio(canvasIn), //获取像素比
					W = opt.W * ratio,
					H = opt.H * ratio,
					maxW = 540 * ratio;

				//alert(ratio);
				canvasIn.width = canvasAdd.width = W;
				canvasIn.height = canvasAdd.height = H;

				canvasIn.style.width = canvasAdd.style.width = opt.W + "px";
				canvasIn.style.height = canvasAdd.style.height = opt.H + "px";

				// 固定位置
				var w1,h1,x1,y1,
					w2,h2,x2,y2,
					w3,h3,x3,y3;

				if ( W > H || W > maxW ) {
					w1 = w2 = maxW;
					x1 = x2 = ( W - w1 )/2;
				} else {
					w1 = w2 = W;
					x1 = x2 = 0;
				}

				h1 = w1*1.4;
				h2 = w2*0.4;
				y1 = H - h1;
				y2 = H - h2;

				h3 = h1;
				w3 = h3*0.25;

				x3 = x1 + (w1-w3);
				y3 = y1;

				//头发丝
				var hairs = [],
					hairsLen = 24,
					imgroot = app.param.data("imgroot");
				for ( var i = 0; i < hairsLen; i++ ) {
					var hair = new Image();
					hair.src = imgroot + 'h' + (i + 1) + '.png';
					hairs[i] = hair;
				}

				//人物渐出
				var img1 = new Image(), //人物
					img2 = new Image(); //slogan

				img1.src = sources[0];
				img2.src = sources[1];

				var start = 0,
						during = 60;
				var fadeIn = function() {
					start += 1;
					var opa = Math.floor((100/during)*start)*0.01;

					ctxIn.clearRect(0, 0, W, H);
					ctxIn.globalAlpha= opa;
					ctxIn.drawImage(img1,x1,y1,w1,h1);
					ctxIn.drawImage(img2,x2,y2-start*2,w2,h2);
					//ctxIn.drawImage(hairs[i],0,0);
					if ( start < during ) {
						requestAnimationFrame(fadeIn);
					}
				};
				fadeIn();

				// 头发丝
				var seconds = 0,
					i = 0,
					handle;
				startTimer();

				//定时
				function timer() {
					seconds += 1;
					if ( seconds == hairsLen ) {
						seconds = 1;
					}
					ctxAdd.clearRect(0, 0, W, H);
					ctxAdd.drawImage(hairs[seconds],x3,y3,w3,h3);
					if ( !app.lock ) {
						stopTimer();
					}
				}
				function startTimer() {
					handle = setInterval(timer,100);
				}
				function stopTimer() {
					clearInterval(handle);
				}

			},

		};


		app.init();

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

	};
}
