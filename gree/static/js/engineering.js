window.onload=function(){
		var len=$("#box>div").length;
		if(len<7){
			$("#engineer_box>div:eq(0)").hide();
			$("#engineer_box>div:eq(2)").hide();
		}
		var flag=0;
		$(".second_class li").click(function(){
			flag=1;
			$("#flag").remove();
			$(this).parent().prev().append("<span id='flag'> ＞"+$(this).text()+"</span>");
		});
		$("#box>div").click(function(){
			var s=$(this).find("p").text();
			$("#engineer_nav span:last").text($(this).find("p").text());
			$("#engineer_title").html(s);
			$.ajax({
				url:"getEngineer",
				type:"post",
				data:{engineername:s},
				success:function(data){
					$("#text").html(data.content);
				},
				error:function(){}
			});
		});
		$("#box>div:eq(0)").click();

		//移动动画
			var n=Math.ceil($("#box>div").length/6);
			var count=0;
			$("#engineer_box>div:eq(0)").click(function(){
				if(count-1<0){
					return;
				}
				count--;
				$("#box>div").animate({left:"+=1014px"});
			});
			$("#engineer_box>div:eq(2)").click(function(){
				if(count+1>=n){
					return;
				}
				count++;
				$("#box>div").animate({left:"-=1014px"});
			});
}