window.onload=function(){
	var len=$("#box>div").length;
	if(len<7){
		$("#stores_box>div:eq(0)").hide();
		$("#stores_box>div:eq(2)").hide();
	}
	
	//点击店铺返回文章
		$("#box>div").click(function(){
			var src=$("img",this).attr("src");
			$("#o_pic img").attr({"src":src});
			var s=$(this).find("p").text();
			$("#stores_nav span:last").text($(this).find("p").text());
			$("#stores_title").html(s);
			$.ajax({
				url:"getStore",
				type:"post",
				data:{storename:s},
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
			$("#stores_box>div:eq(0)").click(function(){
				if(count-1<0){
					return;
				}
				count--;
				$("#box>div").animate({left:"+=1014px"});
			});
			$("#stores_box>div:eq(2)").click(function(){
				if(count+1>=n){
					return;
				}
				count++;
				$("#box>div").animate({left:"-=1014px"});
			});
}