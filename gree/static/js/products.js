window.onload=function(){
		var len=$("#box>div").length;
		if(len>7){
			$("#products_box>div:eq(0)").css("display","inline-block");
			$("#products_box>div:eq(2)").css("display","inline-block");
		}
	//点击产品发送ajax请求
		var flag=0;
		var fc="";
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
			//发送产品请求
				fc=$(this).find("span:eq(0)").text();
				$.ajax({
					url:"/getProduct",
					type:"post",
					data:{classone:fc},
					success:function(data){
						var s="";
						var len=data.products.length;
						for(var i=0;i<len;i++){
							s+="<div><img src='"+data.products[i].picname+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
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
						PicAdjust(140,100,"#box");
						pmove();
					},
					error:function(){}
				});
		});
		$("#class_box>ul>li:eq(0)").click();
	//二级分类请求
		$(".second_class li").click(function(){
			//页面变化
				flag=1;
				$("#flag").remove();
				$(this).parent().prev().after("<span id='flag'> ＞"+$(this).text()+"</span>");
			//请求产品
				fc=$(this).parent().closest("li").find("span:eq(0)").text();
				var sc=$(this).text();
				$.ajax({
					url:"/getProduct",
					type:"post",
					data:{classone:fc,classtwo:sc},
					success:function(data){
						var s="";
						var len=data.products.length;
						for(var i=0;i<len;i++){
							s+="<div><img src='"+data.products[i].picname+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
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
						PicAdjust(140,100,"#box");
						pmove();
					},
					error:function(){}
				});
			});
	//产品详情请求
		$("#box").delegate(">div","click",function(){
			var sc=$(this).attr("data-class");
			var pname=$("p",this).text();
			$.ajax({
				url:"getProduct",
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
					PicAdjust(100,100,"#pics");
					PicAdjust(370,370,"#b_pic_box");
					ppmove();
					$("#products_show").show();
				},
				error:function(){}
			});
		});
		$(".sell_well>div").click(function(){
			var co=$(this).siblings("p").text();
			var sc=$(this).attr("data-class");
			var pname=$("p",this).text();
			$.ajax({
				url:"getProduct",
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
						s+="<img src='"+data.picsrc[i]+"'>"+"\n";
					}
					$("#pics").html(s);
					$("#b_pic_box img").attr({"src":data.picsrc[0]});
					$("#spcf").html(data.table);
					$("#article").html(data.content);
					window.scrollTo(0,0);
					PicAdjust(100,100,"#pics");
					PicAdjust(370,370,"#b_pic_box");
					ppmove();
					$("#products_show").show();
				},
				error:function(){}
			});
		});

	//表格格式
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

	//*二级分类位置自适应
		len=$("#subtitle .second_class").length;
		var count=1;
		for(var i=0;i<len;i++){
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
				//adjust(h,i);
			}
		}
		function adjust(h,i){
			if(h>30){
				$("#subtitle .second_class").eq(i).css({"margin-left":(-100*count)+"px"});
				count++;
				var h2=$("#subtitle .second_class").eq(i).height();
				if(h2>30){
					adjust(h2,i);
				}
			}
		}
		//alert($("#subtitle .second_class").eq(4).width());
	//*/

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
				$("#box>div").animate({left:"+=1014px"});
			});
			$("#products_box>div:eq(2)").unbind("click");
			$("#products_box>div:eq(2)").click(function(){
				if(pcount+1>=pn){
					return;
				}
				pcount++;
				$("#box>div").animate({left:"-=1014px"});
			});
		}
	//产品展示图片移动动画
		function ppmove(){
			var ppn=Math.ceil($("#pics>img").length-3);
			var ppcount=0;
			$("#s_pics>div:eq(0)").unbind("click");
			$("#s_pics>div:eq(0)").click(function(){
				if(ppcount<1){
					return;
				}
				ppcount--;
				$("#pics>img").animate({left:"+=110.5px"});
			});
			$("#s_pics>div:eq(2)").unbind("click");
			$("#s_pics>div:eq(2)").click(function(){
				if(ppcount>=ppn){
					return;
				}
				ppcount++;
				$("#pics>img").animate({left:"-=110.5px"});
			});
		}
	//产品点击显示大图
		$("#pics").delegate("img","click",function(){
			var s=$(this).attr("src");
			$("#b_pic_box img").attr({"src":s});
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
				if(r2>r1){
					var h=w1*h2/w2;
					$(selector).find("img").eq(i).css({"padding":((h1-h)/2)+"px 0"});
				}
			}
		}

		PicAdjust(160,160,"#susume");
}