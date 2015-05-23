window.onload=function(){
	$("#go_r").click(function(){
		$("#lr_box").css("-webkit-animation","rotate 0.5s linear 0 1");
		setTimeout(function(){
		$("#icode img").click();
		$("#n_password,#go_l,#regis").show();
		$("#go_r,#login").hide();
		$(".input p").text("");
		$(".input div input,#icode input").val("");
		$("#lr_box").css("-webkit-animation","rotate2 0.5s linear 0 1");
		},500);
	});
	$("#go_l").click(function(){
		$("#lr_box").css("-webkit-animation","rotate3 0.5s linear 0 1");
		setTimeout(function(){
		$("#icode img").click();
		$("#go_r,#login").show();
		$("#n_password,#go_l,#regis").hide();
		$(".input p").text("");
		$(".input div input,#icode input").val("");
			$("#lr_box").css("-webkit-animation","rotate4 0.5s linear 0 1");
		},500);
	});

	//验证码
	$("#icode img").click(function(){
		$("#icode img").attr({"src":"/getCAPTCHA/?nocache="+Math.random()});
	});

	
	//发送消息前字符检测
	$("#login").click(function(){
		var account=$("#account input").val();
		var password=$("#password input").val();
		var icode=$("#icode input").val();
		if(!(account)){
			$("#account p").text("值为空！");
			flag[0]=0;
		}
		if(!(password)){
			$("#password p").text("值为空！");
			flag[1]=0;
		}
		if(icode.length!=4){
			$("#icode p").text("位数不够！");
			flag[3]=0;
		}
		if(flag[0]==1&&flag[1]==1&&flag[3]==1){
			var xmlhttp=new XMLHttpRequest();
			xmlhttp.open("POST","/login",false);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("account="+account+"&password="+password+"&icode="+code);
			if(xmlhttp.responseText.charAt(0)=="{"){
				var AjaxObj=eval("("+xmlhttp.responseText+")");
				if(AjaxObj.account){
					$("#account p").text(AjaxObj.account);
				}
				else if(AjaxObj.password){
					$("#password p").text(AjaxObj.password);
				}
				else if(AjaxObj.icode){
					$("#icode p").text(AjaxObj.icode);
				}
				else if(AjaxObj.status=="success"){
					window.location.reload();
				}
			}
		}
	});
	$("#regis").click(function(){
		var account=$("#account input").val();
		var password=$("#passord input").val();
		var n_password=$("#n_password input").val();
		var icode=$("#icode input").val();
		if(!(account)){
			$("#account p").text("值为空！");
			flag[0]=0;
		}
		if(!(password)){
			$("#password p").text("值为空！");
			flag[1]=0;
		}
		if(!(n_password)){
			$("#n_password p").text("值为空！");
			flag[2]=0;
		}
		if(icode.length!=4){
			$("#icode p").text("位数不够！");
			flag[3]=0;
		}
		if(flag[0]==1&&flag[1]==1&&flag[2]==1&&flag[3]==1){
			var xmlhttp=new XMLHttpRequest();
			xmlhttp.open("POST","/regist",false);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("account="+account+"&passworde="+username+"&n_password="+password+"&icode="+code);
			if(xmlhttp.responseText.charAt(0)=="{"){
				var AjaxObj=eval("("+xmlhttp.responseText+")");
				if(AjaxObj.account){
					$("#account p").text(AjaxObj.account);
				}
				else if(AjaxObj.password){
					$("#password p").text(AjaxObj.password);
				}
				else if(AjaxObj.n_password){
					$("#n_password p").text(AjaxObj.n_password);
				}
				else if(AjaxObj.icode){
					$("#icode p").text(AjaxObj.icode);
				}
				else if(AjaxObj.status=="success"){
					window.location.reload();
				}
			}
		}
	});
	//登录注册输入框字符检测
	var pattern1=/[^!-z]/,
	pattern2=/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
	pattern3=/^[\u4e00-\u9fa5A-Za-z0-9_]+$/,
	pattern4=/[^_a-zA-Z0-9]/;
	var flag=new Array();
	$("#account input").on({
		"input":function(){
			var str=$(this).val();
			if(pattern4.test(str)){
				$("#account p").text("字符有误");
				flag[0]=0;
			}
			else {
				$("#account p").text("");
				flag[0]=1;
			}
		}
	});
	$("#password input").on({
		"input":function(){
			var str=$(this).val();
			if(pattern1.test(str)){
				$("#password p").text("字符有误");
				flag[1]=0;
			}
			else {
				$("#password p").text("");
				flag[1]=1;
			}
		},
		"blur":function(){
			var str=$(this).val();
			var str2=$("#n_password input").val();
			if(str2&&str!=str2){
				$("#n_password p").text("两次密码不同！");
				flag[1]=0;
			}
			else{
				$("#n_password p").text("");
				flag[1]=1;
			}
		}
	});
	$("#n_password input").on({
		"input":function(){
			var str=$(this).val();
			if(pattern1.test(str)){
				$("#n_password p").text("字符有误");
				flag[2]=0;
			}
			else {
				$("#n_password p").text("");
				flag[2]=1;
			}
		},
		"blur":function(){
			var str=$(this).val();
			var str2=$("#password input").val();
			if(str!=str2){
				$("#n_password p").text("两次密码不同！");
				flag[2]=0;
			}
			else{
				flag[2]=1;
			}
		}
	});
	$("#icode input").on({
		"input":function(){
			var str=$(this).val();
			if(pattern4.test(str)){
				$("#icode p").text("字符有误");
				flag[3]=0;
			}
			else {
				$("#icode p").text("");
				flag[3]=1;
			}
		},
		"blur":function(){
			var str=$(this).val();
			if(str.length!=4){
				$("#icode p").text("位数不够！");
				flag[3]=0;
			}
			else{
				flag[3]=1;
			}
		}
	});
}