测试
###绝对定位模拟固定定位
	市场上移动端浏览器太多，有些低版本浏览器不支持固定定位，此时只能用绝对定位模拟固定定位
	
###雪碧图
	雪碧图，精灵图，css精灵，图片整合技术， Sprite ， css Sprite
		
###CSS几个特别属性
	input{
	    outline: none;
	}   外轮廓
	
	placeholder 字体颜色
	input::-webkit-input-placeholder{
	     color: #333;
	}
	
	获取焦点
	input:focus{
	    background: #fff;
	}
	
	高亮
	-webkit-tap-highlight-color: rgba(0,0,0,0)		
	
	a伪类 hover link active visited   lvha
	
	
###拖拽中拖的过程（橡皮筋）
	在touchmove中实现
	我们之前实现一个限定范围的过程，导致范围限定死 ---不符合我们的需要
	效果：可以拖拽，但是，越来越难拖
	实现：通过一个scale，来实现
		左边：（左边留白/屏幕的宽度）
			scale = 1- translateX / document.documentElement.clientWidth;
			范围：在原有的拖拽的距离*比例，得到最终拖拽的结果
			translateX = translateX * scale;
		右边：
			注意点：留白区域over
			var minX = document.documentElement.clientWidth-navsList.offsetWidth;
			var over = minX - translateX;
				  考虑正负方向
				  
			translateX = minX - (over * scale);

###快速滑屏(加速)
	在touchend中实现
	有一个速度产生：
		定义了七个变量
		var s1 = 0;
		var s2 = 0;
		var t1 = 0;
		var t2 = 0;
			
		var disT = 1;
		var disS = 0;
	
		var speed = disS/disT
	
		目标距离：在我原有拖拽距离(touchmove)的基础上，加上speed产生的位移
		var target = transformCss(navList,'translateX') + speed*100;
		
		回弹效果：
			限定回弹的范围，产生过度效果，cubic-bezier(0,1.57,.41,1.73)产生
	
		
		bug:手指一点一抬，disS = 0，disT=0，导致speed为NAN,所以var disTime = 1;
	
		当我做一个完整的拖拽过程，然后我再去点击ul,speed = disVal/disTime还存在，所以应该在touchstart清除
	
###点击变色
	
	给每一个li遍历，绑定监听事件
	此时再给每一个li遍历，清除原有的样式，再给对应的li添加className
	
	但是，有误触的效果
		如果li上发生了touchmove，就不要触发touchend
		所以在touchmove中，给相应的li,添加isMove，并且置为true，
		只要isMove为true,就在touchmove中执行，不触发touchend
		重置isMove
		
###防抖动
	单方向：首次滑动时，disY>disX，禁止掉X方向上面的逻辑
	
	多方向：多次touchmove
		定义两个变量
			//是否是第一次touchmove
			var isFirst = true;
			//非第一次的逻辑是否执行
			var isX = true;	
	
		在touchmove中，如果isFirst = true(证明我此时第一次进来)，此时让我isFirst = false，
			并且，一旦disY>disX,就禁止掉X轴上面的逻辑，isX = false；return
			
		当我多次touchmove，我要判断我上一次滑动的isX到底禁止还是没有禁止
		如果isX = false，直接return。
	
	当我第二次进入touchstart,需要清除掉上一次move中的isFirst和isX的状态，
	并把他们重新置回true

	
###文字省略号
	display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;	
	
	
###tab切换
		
	1.用js重置主体位置，-target
	2.在touchmove时，当手指划过1/2，立马跳到下一页(loading图)   0 或者 -2*target
	3.在touchend时，当手指未划过1/2，跳到当前页面-target
	
	4.load什么时候出现
		给load图先做一个标识
		默认一开始没有
		当手指touchmove划过1/2，出现,所有逻辑都需禁止掉
		
    5.load出现之后的操作
    	当页面彻底切换过去之后（过渡结束），load才出现
    	过渡结束：
    		兼容处理
    			tabWrap.addEventListener('transitionend',transitionEnd);
				tabWrap.addEventListener('webkitTransitionEnd',transitionEnd);
    		解绑处理
				tabWrap.removeEventListener('transitionend',transitionEnd);
				tabWrap.removeEventListener('webkitTransitionEnd',transitionEnd);
		
	6.同步小绿(span)
		拿到a元素距离父元素的offsetleft









###即点即停
	由于过渡只能得到最终的结果，我们需要实现点击，立刻停止的效果
	我们用tween模拟过渡
	
	var Tween = {
		//默认样式
		Linear: function(t,b,c,d){ return c*t/d + b; },
		//超出
		easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        	}			
	};
		
		Tween['Linear']();

		t:当前次数
		b:初始位置
		c:初始位置与最终位置的差值
		d：总次数
		s:回弹系数比例距离（s越大，回弹距离越远）
		
		返回值：每次运动需要达到的距离

###滚动条比例问题
	
	scale1滚动条高度的系数
		滚动条高度/视口高度 = 视口高度/内容高度
	
		scale1 = 视口高度/内容高度


	scale2内容区与滚动条位移距离的系数

		滚动条的偏移量/(视口高度-滚动条高度) = 内容偏移量/(内容高度-视口高度)
	
		==> 滚动条的偏移量 = 内容偏移量* ((视口高度-滚动条高度)/(内容高度-视口高度))
		
			内容偏移量 = 滚动条的偏移量 / ((视口高度-滚动条高度)/(内容高度-视口高度))
		
			内容偏移量 = 滚动条的偏移量 /scale1


			滚动条的偏移量 = 内容偏移量 * scale

