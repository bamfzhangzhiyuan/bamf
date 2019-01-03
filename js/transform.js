(function(w){
	w.transformCss = function (box,name,value){
			//创建一个对象，用来名值对，键值对
//			var obj = {};
			if(!box.obj){
				box.obj = {};
			};
			
			//写入
			if(arguments.length > 2){
				//把名值对添加到对象中去
				box.obj[name] = value;
				
				//保存css样式结果
				var result = '';
				
				//把box.obj每一个对象拿出来
				for(var i in box.obj){
					switch (i){
						case 'translateX':
						case 'translateY':
						case 'translate':
						case 'translateZ':
							result += i+'('+ box.obj[i] +'px) ';
							break;
						case 'scaleX':
						case 'scaleY':
						case 'scale':
							result += i+'('+ box.obj[i] +') ';
							break;
						case 'rotate':
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
						case 'skew':
						case 'skewX':
						case 'skewY':
							result += i+'('+ box.obj[i] +'deg) ';
							break;	
					}
					
				};
				
				//把result 添加node
				box.style.transform = result;
				
			}else{
				//读取				
				//1.直接读取 --- 默认值
				if(box.obj[name] == undefined){
					//scale === 1
					if(name =='scale'|| name=='scaleX'||name=='scaleY'){
						value = 1;
					}else{
						//translate , rotate ,skew ==0
						value = 0;
					}
					
				}else{
					//2.写 --- 读取
					value = box.obj[name];
				};
				
				return value;
							
			};
			
			
		};
		
	
})(window);
