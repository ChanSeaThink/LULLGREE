window.onload=function(){
	$("#view").height(window.innerHeight);
	var w=$("#lr_box").width();
	var h=$("#lr_box").height();
	$("#lr_box").css({"margin-top":"-"+h/2+"px","margin-left":"-"+w/2+"px"});

	$("#go_r").click(function(){
		$("#lr_box").css("-webkit-animation","rotate 0.5s linear 0 1");
		setTimeout(function(){
		$("#n_password,#go_l,#regis").show();
		$("#go_r,#login").hide();
			$("#lr_box").css("-webkit-animation","rotate2 0.5s linear 0 1");
		},500);
	});
	$("#go_l").click(function(){
		$("#lr_box").css("-webkit-animation","rotate3 0.5s linear 0 1");
		setTimeout(function(){
		$("#go_r,#login").show();
		$("#n_password,#go_l,#regis").hide();
			$("#lr_box").css("-webkit-animation","rotate4 0.5s linear 0 1");
		},500);
	});
}