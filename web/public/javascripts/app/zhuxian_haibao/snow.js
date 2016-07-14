/**
* @description 制作页 -- 诛仙海报
* @author wwl98670@alibaba-inc.com ### 20160603
* @update
*/

define(function(require, exports, module) {
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
			//console.log(parseInt(Min + Math.round(Rand * Range)));
			return parseInt(Min + Math.round(Rand * Range));
		},

		//粒子运动算法（数学盲表示心累）
		update: function(opt){
			var angle = opt.angle,
					mp = opt.mp,
					particles = opt.particles,
					W = opt.W,
					H = opt.H;

			angle += 0.01;

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

		reset: function(opt){
			var flake = opt.flake,
					W = opt.W,
					H = opt.H;
			if (app.windPower == false || app.windPower == 0) {
					flake.x = Math.floor(Math.random() * W);
					flake.y = 0;
			} else {
				if (app.windPower > 0) {
					var xarray = Array(Math.floor(Math.random() * W), 0);
					var yarray = Array(0, Math.floor(Math.random() * H))
					var allarray = Array(xarray, yarray)

					var selected_array = allarray[Math.floor(Math.random()*allarray.length)];

					flake.x = selected_array[0];
					flake.y = selected_array[1];
				} else {
					var xarray = Array(Math.floor(Math.random() * W),0);
					var yarray = Array(W, Math.floor(Math.random() * H))
					var allarray = Array(xarray, yarray)

					var selected_array = allarray[Math.floor(Math.random()*allarray.length)];

					flake.x = selected_array[0];
					flake.y = selected_array[1];
				}
			}

			flake.speed = (Math.random() * 1) + app.speed;
			flake.velY = flake.speed;
			flake.velX = 0;
		}

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
			that.canvasRole = $("#canvasRole");
			that.param = $('#canvasParam');
			that.close = $('#cv_close');

			that.windPower = -6;
			that.speed = 0.8;

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
					canvasRole = app.canvasRole[0];

			var ctx = canvas.getContext("2d"),
					ctxRole = canvasRole.getContext("2d");

			//canvas dimensions
			var W = window.innerWidth,
					H = window.innerHeight;

			canvas.width = canvasRole.width = W;
			canvas.height = canvasRole.height = H;

			tool.setCss(con, {
				'height': H + 'px'
			});

			//飘花儿
			app.flowersDraw({
				ctx: ctx,
				canvas: canvas,
				W: W,
				H: H,
				mp: 10
			});

			//碧池出现
			app.moveInDraw({
				ctx: ctx,
				ctxRole: ctxRole,
				canvas: canvas,
				canvasRole: canvasRole,
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
			for (var i = 0; i < 11; i++) {
				var im = new Image();
				im.src = imgroot + 'f' + (i + 5) + '.png';
				flowers[i] = im;
			}

			//撒种子
			var flakes = [],
					flakeCount = 5,
					mX = 0,
					mY = 0,
					speed = app.speed,
					windPower = app.windPower;

			for (var i = 0; i < flakeCount; i++) {
					var x = Math.floor(Math.random() * W),
							y = Math.floor(Math.random() * H),
							speed = (Math.random() * 1) + speed;

				flakes.push({
					speed: speed,
					velY: speed,
					velX: 0,
					x: x,
					y: y,
					stepSize: (Math.random()) / 30,
					step: 0,
					r: tool.getRandomNum(5,14)
				});
			}

			//开花
			requestAnimationFrame(flower);

			//花开不败
			function flower(){
				try {
					ctx.clearRect(0, 0, W, H);

					for (var i = 0; i < flakeCount; i++) {

						var flake = flakes[i],
								x = mX,
								y = mY,
								x2 = flake.x,
								y2 = flake.y;

						flake.velX *= 0.98;
						if (flake.velY <= flake.speed) {
							flake.velY = flake.speed
						}

						switch ( windPower ) {
							case false:
								flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
								break;

							case 0:
								flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
								break;

							default:
								flake.velX += 0.02 + (windPower/100);
						}

						flake.y += flake.velY;
						flake.x += flake.velX;

						if (flake.x >= W+5 || flake.x < -5 || flake.y > H ) {
							tool.reset({
								flake: flake,
								W: W,
								H: H
							});
						}

						var p = flake;

						var hua = flowers[p.r-5],
								huaW = hua.width / 2,
								huaH = hua.height / 2;

						ctx.drawImage(hua, p.x, p.y, huaW, huaH);

					}
					ctx.drawImage(canvas, 0, 0);

				} catch (e) {
					canvas.style.display = 'none';
					app.lock = 0;
				}


				//除非被关闭了要不就一直开一直开开开
				if ( app.lock ) {
					requestAnimationFrame(flower);
				}

			}

		},

		//人物出现动画
		moveInDraw: function (opt){
			var ctx = opt.ctx,
					ctxRole = opt.ctxRole,
					canvas = opt.canvas,
					canvasRole = opt.canvasRole,
					W = opt.W,
					H = opt.H;
			//定位
			var roleW,
					roleH,
					posX,
					posY;

			if ( W > H || W > 540 ) {
				roleW = 540;
				posX = (W - roleW) / 2;
			} else {
				roleW = W;
				posX = 0;
			}
			roleH = roleW*1.4;
			posY = H - roleH;

			//定图
			var imgRole = new Image();
			imgRole.src = sources[0]

			//执行
			var seconds = 0,
					i = 0,
					handle;
			startTimer();

			//定时
			function timer() {
				seconds += 1;
				i += 2;
				ctxRole.clearRect(0, 0, W, H);
				ctxRole.globalAlpha= 0.01*(i-1);
				ctxRole.drawImage(imgRole,posX,posY,roleW,roleH);
				//console.log(0.01*(i-1));
				if ( seconds == 60 ) {
					stopTimer();
				}
			}
			function startTimer() {
				handle = setInterval(timer,35);
			}
			function stopTimer() {
				clearInterval(handle);
			}

		},
	};


	app.init();

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

});