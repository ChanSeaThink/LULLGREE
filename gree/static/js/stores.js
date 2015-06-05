window.onload=function(){
	var len=$("#box>div").length;
	if(len>6){
		$("#stores_box>div:eq(0)").css("display","inline-block");
		$("#stores_box>div:eq(2)").css("display","inline-block");
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
		PicAdjust(140,100,"#box");
}