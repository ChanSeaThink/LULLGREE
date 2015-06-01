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
		$("#subtitle li:eq(0)").click();

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