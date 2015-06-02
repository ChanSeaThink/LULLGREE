window.onload=function(){
		var len=$("#box>div").length;
		if(len<7){
			$("#products_box>div:eq(0)").hide();
			$("#products_box>div:eq(2)").hide();
		}
	//点击产品发送ajax请求
		var flag=0;
		//一级分类请求
		$("#subtitle>ul>li").on({
			"click":function(){
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
				//$(".all").hide();
				$("."+this.id).show();
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
			}
		});
		$("#subtitle>ul>li").click(function(){
			var fc=$(this).find("span").text();
			data={products:[
				{picname:"XX1",productname:"YY1"},
				{picname:"XX2",productname:"YY2"},
				{picname:"XX3",productname:"YY3"},
				{picname:"XX4",productname:"YY4"},
				{picname:"XX5",productname:"YY5"},
				{picname:"XX6",productname:"YY6"},
				{picname:"XX7",productname:"YY7"},
				{picname:"XX8",productname:"YY8"},
				{picname:"XX9",productname:"YY9"},
				{picname:"XX10",productname:"YY10"},
				{picname:"XX12",productname:"YY11"},
				{picname:"XX12",productname:"YY12"},
			]};
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
		//二级分类请求
		$(".second_class li").click(function(){
			flag=1;
			$("#flag").remove();
			$(this).parent().prev().append("<span id='flag'> ＞"+$(this).text()+"</span>");
		});
		//产品详情请求
		$(".products_box img").click(function(){
			$("#p_details").show();
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

	/*二级分类位置自适应
		len=$("#subtitle .second_class").length;
		var count=1;
		for(var i=0;i<len;i++){
			var s=$("#subtitle .second_class").eq(i).width()+12;
			var h=$("#subtitle .second_class").eq(i).height();
			var w=$("#subtitle .second_class").eq(i).siblings("span").width();
			if(h<30){
				$("#subtitle .second_class").eq(i).css({"margin-left":(w/2-s/2)+"px"});
			}
			else{
				adjust(h,i);
			}
			alert($("#subtitle .second_class").eq(i).css("margin-left"))
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

	//移动动画
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
}