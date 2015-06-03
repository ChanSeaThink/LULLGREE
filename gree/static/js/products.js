window.onload=function(){
		var len=$("#box>div").length;
		if(len>7){
			$("#products_box>div:eq(0)").css("display","inline-block");
			$("#products_box>div:eq(2)").css("display","inline-block");
		}
	//一级类分段显示
		function fcmove(){
			var fcn=$("#class_box>ul>li").length;
			var fcp=Math.ceil($("#class_box>ul>li").length/5);
			var fccount=0;
			var mlength=new Array();
			var i=0;
			for(i=0;i<fcp;i++){
				var l1=$("#class_box>ul>li").eq(i*5).offset().left;
				var l2;
				if(i+1<fcp){
					l2=$("#class_box>ul>li").eq((i+1)*5).offset().left;
					mlength[i]=l2-l1;
				}
				else{
					mlength[i]=$("#class_box>ul").offset().left+$("#class_box>ul")[0].scrollWidth-$("#class_box>ul>li").eq(i*5).offset().left;
				}
			}
			$("#class_box>ul").width(mlength[0]);
			$("#class_box").css("left",0);
			if(fcn<=5){
				$("#cleft,#cright").hide();
			}
			$("#class_box").show();
			$("#cright").unbind("click");
			$("#cright").click(function(){
				if(fccount+1>=fcp){
					return;
				}
				$("#class_box>ul>li:eq(0)").animate({"margin-left":"-="+mlength[fccount]+"px"});
				fccount++;
				$("#class_box>ul").animate({"width":mlength[fccount]});
				//$("#class_box>ul").width(mlength[fccount]);
			});
			$("#cleft").unbind("click");
			$("#cleft").click(function(){
				if(fccount<1){
					return;
				}
				fccount--;
				$("#class_box>ul>li:eq(0)").animate({"margin-left":"+="+mlength[fccount]+"px"});
				$("#class_box>ul").animate({"width":mlength[fccount]});
				//$("#class_box>ul").width(mlength[fccount]);
			});
		}
	fcmove();
	//点击产品发送ajax请求
		var flag=0;
		var fc="",sc="";
		var ppgt=0;
	//一级分类请求
		$("#class_box>ul>li").click(function(){
				if(flag==0){
					$("#flag").remove();
				}
				else if(flag==1){
					flag=0;
				}
				$("#class_box>ul>li").css({
					"background-color":"white",
					"color":"#22222a"
				});
				$(this).css({
					"background-color":"rgba(65,65,65,0.3)",
					"color":"white"
				});
				$(">span",this).css({
					"border-bottom":"none"
				});
			//处理mouseout的不同性
				$("#class_box>ul>li").unbind("mouseout");
				$("#class_box>ul>li").mouseout(function(){
					$(">span",this).css({
						"border-bottom":"none"
					});
					$(".second_class",this).hide();
				});
				$(this).unbind("mouseout");
				$("#class_box>ul>li").mouseout();
				$(this).mouseout(function(){
					$(".second_class",this).hide();
				});
			//处理mouseover的不同性
				$("#class_box>ul>li").unbind("mouseover");
				$("#class_box>ul>li").mouseover(function(){
					$(">span",this).css({
						"border-bottom":"2px solid"
					});
					$(".second_class",this).show();
				});
				$(this).unbind("mouseover");
				$(this).mouseover(function(){
					$(".second_class",this).show();
				});
			//整理一级类动画
				fcmove();
			//发送产品请求
				if(ppgt==1){
					ppgt=0;
					return;
				}
				var fc1=$(this).find("span:eq(0)").text();
				var sc1=$(this).find("ul>li:eq(0)").text();
				$.ajax({
					url:"/getProducts",
					type:"post",
					data:{classone:fc1},
					success:function(data){
						var s="";
						var len=data.products.length;
						for(var i=0;i<len;i++){
							s+="<div><img src='"+data.products[i].picsrc+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
						}
						if(len<7){
							$("#products_box>div:eq(0)").hide();
							$("#products_box>div:eq(2)").hide();
						}
						else{
							$("#products_box>div:eq(0)").css("display","inline-block");
							$("#products_box>div:eq(2)").css("display","inline-block");
						}
						$("#box").html(s);
						fc=fc1;
						sc=sc1;
						$("#box img:last").load(function(){
							PicAdjust(140,100,"#box");
						});
						pmove();
					},
					error:function(){}
				});
		});
		$("#class_box>ul>li:eq(0)").click();
	//二级分类请求 
		$(".second_class li").click(function(event){
				ppgt=1;
			//页面变化
				flag=1;
				$("#flag").remove();
				$(this).parent().prev().after("<span id='flag'> ＞"+$(this).text()+"</span>");
			//整理一级类动画
				fcmove();
			//请求产品
				var fc1=$(this).parent().closest("li").find("span:eq(0)").text();
				var sc1=$(this).text();
				$.ajax({
					url:"/getProducts",
					type:"post",
					data:{classone:fc1,classtwo:sc1},
					success:function(data){
						var s="";
						var len=data.products.length;
						for(var i=0;i<len;i++){
							s+="<div><img src='"+data.products[i].picsrc+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
						}
						if(len<7){
							$("#products_box>div:eq(0)").hide();
							$("#products_box>div:eq(2)").hide();
						}
						else{
							$("#products_box>div:eq(0)").css("display","inline-block");
							$("#products_box>div:eq(2)").css("display","inline-block");
						}
						$("#box").html(s);
						fc=fc1;
						sc=sc1;
						$("#box img:last").load(function(){
							PicAdjust(140,100,"#box");
						});
						pmove();
					},
					error:function(){}
				});
		});
	//产品详情请求
		$("#box").delegate(">div","click",function(){
			var pname=$("p",this).text();
			$.ajax({
				url:"/getProducts",
				type:"post",
				data:{classone:fc,classtwo:sc,productname:pname},
				success:function(data){
					$("#pics").html("");
					$("#b_pic_box img").attr({"src":""});
					$("#spcf").html("");
					$("#article").html("");
					$("#products_nav .class:eq(1)").text(fc);
					$("#products_nav .pname:eq(1)").text(pname);
					$("#products_nav .class").show();
					$("#products_nav .pname").show();
					$("#susume").hide();
					var s="";
					for(var i=0;i<data.picsrc.length;i++){
						s+="<img src='"+data.picsrc[i]+"'>"+"\n";
					}
					$("#pics").html(s);
					$("#b_pic_box img").attr({"src":data.picsrc[0]});
					$("#spcf").html(data.table);
					$("#article").html(data.content);
					TableStyle();
					ppmove();
					$("#products_show").show();
					$("#pics img:last").load(function(){
						PicAdjust(100,100,"#pics");
						PicAdjust(370,370,"#b_pic_box");
					});
				},
				error:function(){}
			});
		});
		$(".sell_well>div").click(function(){
			var co=$(this).siblings("p").text();
			var sc=$(this).attr("data-class");
			var pname=$("p",this).text();
			$.ajax({
				url:"getProducts",
				type:"post",
				data:{classone:co,classtwo:sc,productname:pname},
				success:function(data){
					$("#pics").html("");
					$("#b_pic_box img").attr({"src":""});
					$("#spcf").html("");
					$("#article").html("");
					$("#products_nav .class:eq(1)").text(co);
					$("#products_nav .pname:eq(1)").text(pname);
					$("#products_nav .class").show();
					$("#products_nav .pname").show();
					$("#susume").hide();
					var s="";
					for(var i=0;i<data.picsrc.length;i++){
						s+="<div><img src='"+data.picsrc[i]+"'></div>"+"\n";
					}
					$("#pics").html(s);
					$("#b_pic_box img").attr({"src":data.picsrc[0]});
					$("#spcf").html(data.table);
					$("#article").html(data.content);
					TableStyle();
					window.scrollTo(0,0);
					ppmove();
					$("#products_show").show();
					$("#pics img:last").load(function(){
						PicAdjust(100,100,"#pics");
						PicAdjust(370,370,"#b_pic_box");
					});
				},
				error:function(){}
			});
		});

	//表格格式
		function TableStyle(){
			var trCount=0;
			$(".table_title td").css("background-color","#226ddd");
			for(var i=0;i<$("#spcf tr").length;i++){
				if($("#spcf tr:eq("+i+")").hasClass("table_title")){
					trCount=0;
				}
				else{
					trCount++;
				}
				if(trCount&&trCount%2==0){
					$("#spcf tr:eq("+i+")").css("background-color","#f1f1f1");
				}
			}
		}

	//二级分类位置自适应
		var sclen=$("#subtitle .second_class").length;
		var count=1;
		for(var i=0;i<sclen;i++){
			var s=$("#subtitle .second_class").eq(i).width()+12;
			var h=$("#subtitle .second_class").eq(i).height();
			var w=$("#subtitle .second_class").eq(i).siblings("span").width();
			var left=$("#subtitle .second_class").eq(i).siblings("span").offset().left;
			if(h<30){
				var mleft=(w-s)/2;
				if(mleft+left<0){
					$("#subtitle .second_class").eq(i).css({"margin-left":(-left+200)+"px"});
				}
				else{
					$("#subtitle .second_class").eq(i).css({"margin-left":mleft+"px"});
				}
			}
			else{
				$("#subtitle .second_class").eq(i).width(500);
			}
		}

	//产品移动动画
		function pmove(){
			var pn=Math.ceil($("#box>div").length/6);
			var pcount=0;
			$("#products_box>div:eq(0)").unbind("click");
			$("#products_box>div:eq(0)").click(function(){
				if(pcount-1<0){
					return;
				}
				pcount--;
				$("#box>div").animate({left:"+=1012.5px"});
			});
			$("#products_box>div:eq(2)").unbind("click");
			$("#products_box>div:eq(2)").click(function(){
				if(pcount+1>=pn){
					return;
				}
				pcount++;
				$("#box>div").animate({left:"-=1012.5px"});
			});
		}
	//产品展示图片移动动画
		function ppmove(){
			var ppn=Math.ceil($("#pics>div").length-3);
			var ppcount=0;
			$("#s_pics>div:eq(0)").unbind("click");
			$("#s_pics>div:eq(0)").click(function(){
				if(ppcount<1){
					return;
				}
				ppcount--;
				$("#pics>div").animate({left:"+=110.5px"});
			});
			$("#s_pics>div:eq(2)").unbind("click");
			$("#s_pics>div:eq(2)").click(function(){
				if(ppcount>=ppn){
					return;
				}
				ppcount++;
				$("#pics>div").animate({left:"-=110.5px"});
			});
		}
	//产品点击显示大图
		$("#pics").delegate("img","click",function(){
			var s=$(this).attr("src");
			$("#b_pic_box img").attr({"src":s});
			$("#b_pic_box img").load(function(){
				PicAdjust(370,370,"#b_pic_box");
			});
		});
	//图片自调整函数
		function PicAdjust(w1,h1,selector){
			//w1:固定宽度 h1:固定高度 w2:实图宽度 h2:实图高度
			var w2,h2;
			var r1=w1/h1;
			var r2;
			for(var i=0;i<$(selector).find("img").length;i++){
				w2=$(selector).find("img").eq(i).width();
				h2=$(selector).find("img").eq(i).height();
				r2=w2/h2;
				if(r2>r1){//比较肥
					$(selector).find("img").eq(i).width(w1);
					var h=w1*h2/w2;
					$(selector).find("img").eq(i).css({"padding":((h1-h)/2)+"px 0"});
				}
				else{
					$(selector).find("img").eq(i).height(h1);
				}
			}
		}
		PicAdjust(160,160,"#susume");
}