window.onload=function(){
		var len=$("#box>div").length;
		if(len<7){
			$("#products_box>div:eq(0)").hide();
			$("#products_box>div:eq(2)").hide();
		}
	//点击产品发送ajax请求
		var flag=0;
		var fc="";
	//一级分类请求
		$("#subtitle>ul>li").click(function(){
				if(flag==0){
					$("#flag").remove();
				}
				else if(flag==1){
					flag=0;
				}
				$("#subtitle>ul>li").css({
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
				$("#subtitle>ul>li").unbind("mouseout");
				$("#subtitle>ul>li").mouseout(function(){
					$(">span",this).css({
						"border-bottom":"none"
					});
					$(".second_class",this).hide();
				});
				$(this).unbind("mouseout");
				$("#subtitle>ul>li").mouseout();
				$(this).mouseout(function(){
					$(".second_class",this).hide();
				});
				//处理mouseover的不同性
				$("#subtitle>ul>li").unbind("mouseover");
				$("#subtitle>ul>li").mouseover(function(){
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
						for(var i=0;i<data.products.length;i++){
							s+="<div><img src='"+data.products[i].picname+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
						}
						$("#box").html(s);
					},
					error:function(){}
				});
		});
		$("#subtitle>ul>li:eq(0)").click();
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
						for(var i=0;i<data.products.length;i++){
							s+="<div><img src='"+data.products[i].picname+"'><p>"+data.products[i].productname+"</p></div>"+"\n";
						}
						$("#box").html(s);
					},
					error:function(){}
				});
			});
	//产品详情请求
		$("#box>div").click(function(){
			var sc=$(this).attr("data-class");
			var pname=$("p",this).text();
			$.ajax({
				url:"getProduct",
				type:"post",
				data:{classone:fc,classtwo:sc,productname:pname},
				success:function(data){
					$("#susume").hide();
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
		var n=Math.ceil($("#box>div").length/6);
		var count=0;
		$("#products_box>div:eq(0)").click(function(){
			if(count-1<0){
				return;
			}
			count--;
			$("#box>div").animate({left:"+=1014px"});
		});
		$("#products_box>div:eq(2)").click(function(){
			if(count+1>=n){
				return;
			}
			count++;
			$("#box>div").animate({left:"-=1014px"});
		});

	//产品展示图片移动动画
}