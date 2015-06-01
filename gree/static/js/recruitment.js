window.onload=function(){
		var sTop=$("#rec_nav2").offset().top;
		$(window).scroll(function(){
			$("#rec_nav2").stop();
			var wScrollTop=$(window).scrollTop();
			var r=wScrollTop-sTop;
			if(r>0){
				$("#rec_nav2").offset({top:wScrollTop});
			}
			else{
				$("#rec_nav2").offset({top:sTop});
			}
		});

	//点击导航
		for(var i=0;i<$(".rec_box").length;i++){
			$(".view:eq("+i+") a").attr({"name":i});
			$("#rec_nav2 a:eq("+i+")").attr({"href":"#"+i});
		}
		$("#rec_nav2 li").click(function(){});
}