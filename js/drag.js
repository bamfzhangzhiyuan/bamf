(function(w){
	w.drag = function (navWrap,callback){
			
			var navList = navWrap.children[0];
			//竖向滑屏，橡皮筋（拖），加速，橡皮筋（回弹）,即点即停，滚动条，防抖动
			transformCss(navList,'translateZ',0.01)
			
			//定义元素初始位置
			var eleY = 0;
			//定义手指初始位置
			var startY = 0;
			
			//加速
			var s1 = 0;
			var s2 = 0;
			var t1 = 0;
			var t2 = 0;
			//距离差 --- 路程
			var disS = 0;
			//时间差  (非零数字)
			var disT = 0.1;
			
			var Tween = {
				//匀速   --- 正常加速
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//回弹  --- 两边橡皮筋回弹
				easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 2.5;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			};
			
			//定时器
			var timer = null;
			
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
			
			//手指按下
			navWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//清除过渡
				navList.style.transition = 'none';
				
				//真正的即点即停
				clearInterval(timer);
				
				//元素初始位置
				eleY = transformCss(navList,'translateY');
				//手指初始位置
				startY = touch.clientY;
				startX = touch.clientX;
				
				//加速时候初始位置与初始时间
				s1 = eleY;
				t1 = new Date().getTime();//毫秒
				//清除上一次速度 ， disS = 0
				disS = 0;
				
				//防抖动 重置
				isFirst = true;
				isY = true;
				
				if(callback && typeof callback['start'] == 'function'){
					callback['start']();
				};
			});			
			//手指移动
			navWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				if(!isY){
					return;
				};
				
				//手指结束位置
				var endY = touch.clientY;
				var endX = touch.clientX;
				//手指距离差
				var disY = endY - startY;
				var disX = endX - startX;
				
				//防抖动
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX) > Math.abs(disY)){
						isY = false;
						return;
					}
				}
				
				
				//范围限定  --- 橡皮筋拖
				var translateY = disY+eleY;
				if(translateY > 0){
					var scale = 0.6 - translateY/(document.documentElement.clientHeight*3);
					translateY = 0 + translateY * scale;					
				}else if(translateY < document.documentElement.clientHeight-navList.offsetHeight){
					var over = Math.abs(translateY) - Math.abs(document.documentElement.clientHeight-navList.offsetHeight)
					var scale = 0.6 - over/(document.documentElement.clientHeight*3);
					translateY = document.documentElement.clientHeight-navList.offsetHeight - over*scale;
				}
				
				//确定元素最终位置
				transformCss(navList,'translateY',translateY);
//				console.log('translateY='+translateY)
				
				//加速时候结束位置与结束时间
				s2 = translateY;
				t2 = new Date().getTime();				
				//距离差 --- 路程
				disS = s2 - s1;
				//时间差
				disT = t2 - t1;
				
				if(callback && typeof callback['move'] == 'function'){
					callback['move']();
				};
			});
			//手指离开
			//加速效果 ， 回弹
			navWrap.addEventListener('touchend',function(){
				//速度 = 路程/时间
//				t2 = new Date().getTime();	
				var speed = disS/disT;				
//				console.log(speed)

				//目标位置 = touchmove产生距离 + 速度产生的距离
				var target = transformCss(navList,'translateY')+ speed*100;
//				console.log('translateY == '+transformCss(navList,'translateY'))
//				console.log('target = '+target)

				// 加速  ， 回弹
				var type = 'Linear';
				if(target > 0){
					target = 0
					type = 'easeOut'
				}else if(target < document.documentElement.clientHeight-navList.offsetHeight){
					target = document.documentElement.clientHeight-navList.offsetHeight
					type = 'easeOut'
				};
				
				//总时间
				var timeAll = 1;
				moveTween(target,timeAll,type);
				
				
			});
			function moveTween(target,timeAll,type){
				//t : 当前次数 (从1开始)
				var t = 0;
				//b : 元素加速起始位置
				var b = transformCss(navList,'translateY');
//				console.log('b='+b)
				//c : 元素的结束位置与起始位置的 距离差
				var c = target - b;
//				console.log('c='+c)
				//d : 总次数 = 总时间/每一次的时间
				var d = timeAll/0.02;
			
				//清除定时器：防止重复开启定时器
				clearInterval(timer);
				timer = setInterval(function(){
					t++;
					
					if(t > d){
						//清除定时器，元素停止
						clearInterval(timer);
						//元素停止的状态
						if(callback && typeof callback['end'] == 'function'){
							callback['end']();
						};
					}else{
						//加速状态
						if(callback && typeof callback['move'] == 'function'){
							callback['move']();
						};
				
						var point = Tween[type](t,b,c,d);
//						console.log('type = '+type)
//						console.log('point='+point)
						//添加到元素位置
						transformCss(navList,'translateY',point);
					};
					
				},20);
				
				
				
			};
			
		};
		
		
	
})(window);
