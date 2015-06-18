window.onload=function(){
		//$("#right").css("width",(window.innerWidth-140)+"px");
   		//window.onresize=function(){
    	//	$("#right").css("width",(window.innerWidth-140)+"px");
    	//}

    //选项选择和点击时的效果
    	$("#list li").mouseover(function(){
    		$(this).css("background-color","#4187F1");
    	});
    	$("#list li").mouseout(function(){
    		$(this).css("background-color","transparent");
    	});
    	$("#list li").click(function(){
    		$("#list li").css({"background-color":"transparent","color":"#f1f1f1","border-left":"6px solid transparent"});
    		$(this).css({"background-color":"white","color":"#34333f","border-left":"6px solid #226ddd"});
    		$("#list li").unbind("mouseover");
    		$("#list li").mouseover(function(){
    			$(this).css("background-color","#4187F1");
    		});
    		$(this).unbind("mouseover");
    		$("#list li").unbind("mouseout");
    		$("#list li").mouseout(function(){
    			$(this).css("background-color","transparent");
    		});
    		$(this).unbind("mouseout");
    		$("#function ul").hide();
    		$("#function ."+this.className).show();
    		$("#function ."+this.className+" li:eq(0)").click();
    	});
    	$("#function li").click(function(){
    		$("#function li").css({"background-color":"transparent"});
    		$(this).css({"background-color":"white","color":"#34333f"});
    		$("#function li").unbind("mouseover");
    		$("#function li").mouseover(function(){
    			$(this).css({"background-color":"#4187F1","color":"white"});
    		});
    		$(this).unbind("mouseover");
    		$("#function li").unbind("mouseout");
    		$("#function li").mouseout(function(){
    			$(this).css({"background-color":"transparent","color":"#34333f"});
    		});
    		$(this).unbind("mouseout");
    	});
    	//选项点击后主页面内容显示对应内容
    	var liRecord="welcome_phrase";
    	$("#details ."+liRecord).show();
    	$("#function li").click(function(){
    		if(liRecord){
    			$("#details ."+liRecord).hide();
    		}
    		liRecord=this.className;
    		$("#details ."+liRecord).show();
    	});
    	$("#top>div").click(function(){
    		if(this.className){
    			$("#function ul").hide();
    			if(liRecord){
    				$("#details ."+liRecord).hide();
    			}
    			liRecord=this.className;
    			$("#details ."+liRecord).show();
    			$("#list li").css({"background-color":"transparent","color":"#f1f1f1","border-left":"6px solid transparent"});
    			$("#list li").mouseover(function(){
    				$(this).css("background-color","#4187F1");
    			});
    			$("#list li").mouseout(function(){
    				$(this).css("background-color","transparent");
    			});
    		}
    		else{
				var form=document.createElement("form");
				form.method="get";
				form.action="/logout";
				form.submit();
			}
    	});

	//页码生成函数
		function showPage(n,id,pn){
			//根据显示项数目生成Ajax式页码栏
			if(n<=10){
				return;
			}
			var max=10;
			var half=Math.floor((max-1)/2);
			var pages=Math.ceil(n/10);
			var gridrecord=0;
			var grid,pagerecord=1;
			var s="";
			if(pages<=max){
				for(var i=1;i<=pages;i++){
					s+="<div>"+i+"</div>";
				}
				s+="<div>></div>";
				$("#"+id).html(s);
				grid=pages;
				$("#"+id+" div").click(function(){
					if(pn){
						c=parseInt(pn);
					}
					else{
						c=parseInt($(this).text());
					}
					if(!c){
						if(pagerecord<pages)
							c=pagerecord+1;
						else
							return;
					}
					$("#"+id+" div:eq("+gridrecord+")").css("background-color","white");
					$("#"+id+" div:eq("+(c-1)+")").css("background-color","#c1c1c1");
					gridrecord=c-1;
					pagerecord=c;
				});
			}
			else{
				for(var i=1;i<=max-1;i++){
					s+="<div>"+i+"</div>";
				}
				s+="<div>...</div><div>"+pages+"</div>";
				s+="<div>></div>";
				$("#"+id).html(s);
				grid=max+1;
				$("#"+id+" div").click(function(){
					if(pn){
						c=parseInt(pn);
					}
					else{
						c=parseInt($(this).text());
					}
					if(!c){
						var clickText=$(this).text();
						if(clickText=="..."){
							if($(this).prev().text()=="1"){
								c=pagerecord-4;
							}
							else{
								c=pagerecord+4;
							}
						}
						else if(pagerecord<pages)
							c=pagerecord+1;
						else
							return;
					}
					if(c-half>2&&c+half<pages-1){
						$("#"+id+" div:eq("+1+")").text("...");
						$("#"+id+" div:eq("+(max-1)+")").text("...");
						for(var i=2;i<(max-1);i++){
							$("#"+id+" div:eq("+i+")").text(i+c-(half+1));
						}
						$("#"+id+" div:eq("+gridrecord+")").css("background-color","white");
						$("#"+id+" div:eq("+(half+1)+")").css("background-color","#c1c1c1");
						gridrecord=(half+1);
					}
					else if(c-half<=2){
						$("#"+id+" div:eq("+(max-1)+")").text("...");
						for(var i=1;i<(max-1);i++){
							$("#"+id+" div:eq("+i+")").text(i+1);
						}
						$("#"+id+" div:eq("+gridrecord+")").css("background-color","white");
						$("#"+id+" div:eq("+(c-1)+")").css("background-color","#c1c1c1");
						gridrecord=c-1;
					}
					else if(c+half>=pages-1){
						$("#"+id+" div:eq("+1+")").text("...");
						for(var i=2;i<max;i++){
							$("#"+id+" div:eq("+i+")").text(i+pages-max);
						}
						$("#"+id+" div:eq("+gridrecord+")").css("background-color","white");
						$("#"+id+" div:eq("+(max-(pages-c))+")").css("background-color","#c1c1c1");
						gridrecord=max-(pages-c);
					}
					else{
						alert("Error!")
					}
					pagerecord=c;
				});
			}
		}

	//编写框生成
		$(".click_edit").click(function(){
			$(".edit_box").remove();
			$(this).parent().append("<div class='edit_box'><div class='edit_function'><span>插入图片</span><span class='pub'>发布文章</span><p class='clear'></p></div><input id='news_title' maxlength='30' placeholder='标题'><div id='text_box' contenteditable><p> </p><p><br></p></div><form id='picform'><input type='file' id='file' accept='image/*'></form></div>");
			$(this).hide();
			setTimeout(function(){$("#text_box").focus();},1000);
			sTop=$("#details .edit_function").offset().top;
		});
	//写作编辑框自动调整长度功能
		var heightMark=300;
		$("#details").delegate("#text_box","input",function(){
			var textbox=document.getElementById("text_box");
			if(!($("#text_box").text())){
				//chrome,safari
				$("#text_box").html("<p> </p><p><br></p>");
				setTimeout(function(){
					$("#text_box").focus();
					var r=document.createRange();
					r.setStart(textbox.childNodes[1],0);
					r.setEnd(textbox.childNodes[1],0);
					window.getSelection().removeAllRanges();
					window.getSelection().addRange(r);
				},1);
			}
			var h=document.body.scrollTop;
			this.style.height=0+"px";
			if(this.scrollHeight>300){
				this.style.height=this.scrollHeight+50+"px";
				window.scrollTo(0,h+this.scrollHeight-heightMark);
				heightMark=this.scrollHeight;
			}
			else{
				this.style.height=this.scrollHeight+"px";
			}
		});
	//编写框粘贴动作
		$("#details").delegate("#text_box","paste",function(){
			var e=window.event;
			e.preventDefault();
			var data=e.clipboardData;
			if(data.getData("text/plain")){
				document.execCommand("insertText",false,data.getData("text/plain"));
				for(var i=0;i<$("#text_box p").length;i++){
					var s=$("#text_box p:eq("+i+")").html();
					if(s.charCodeAt(0)==13){
						$("#text_box p:eq("+i+")").html("<br>");
					}
					else if(s.charCodeAt(s.length-1)==13){
						$("#text_box p:eq("+i+")").html(s.slice(0,-1));
					}
				}
			}
		});

	//插入表格行函数
		function TrInsert(selector){
			var newTr="<tr>"+$(selector+" tr:eq(0)").html()+"</tr>";
			$(selector).append(newTr);
			var nTr=$(selector+" tr").length-1;
			var nTd=$(selector+" tr:eq(0) td").length;
			if($(selector+" tr:eq(0) td:eq(0)").hasClass("number")){
				$(selector+" tr:eq("+nTr+") td:eq(0) span").text(nTr);
			}
		}


	//-----------------------account_manage-----------------------
		$("#top .account_manage").click(function(){
			var table=$("#details .account_manage table table");
			var len=table.find("tr").length;
			for(var i=1;i<len;i++){
				table.find("tr:eq(1)").remove();
			}
			$.ajax({
				url:"getAccount",
				type:"get",
				data:null,
				success:function(data){
					for(var i=0;i<data.userinfo.length;i++){
						TrInsert("#details .account_manage table table");
						$("#details .account_manage table table tr:last .account span").text(data.userinfo[i].account);
						$("#details .account_manage table table tr:last .permission span").text(data.userinfo[i].permission);
						if(data.userinfo[i].permission<2){
							$("#details .account_manage table table tr:last .operation").html("<span class='button'>编辑</span><span class='button'>删除</span>");
						}
						else{
							$("#details .account_manage table table tr:last .operation").html("无法修改");
						}
					}
				}
			});
		});
		var number=0;//记录删除的行数
		$("#details .account_manage").delegate(".button","click",function(){
			var t=this;
			var permission=$(this).parent().siblings(".permission");
			if($(this).text()=="编辑"){
				var opms=permission.find("span").text();
				permission.find("span").hide();
				permission.append("<select><option>0</option><option>1</option></select>");
				permission.find("option:contains('"+opms+"')").attr("selected", "selected");
				$(this).text("确定");
				$(this).next().text("取消");
			}
			else if($(this).text()=="删除"){
				$("#bottom").show();
				var act=$(this).parent().siblings(".account").find("span").text();
				$("#full .account_manage .delete p span").text(act);
				$("#full .account_manage .delete").show();
			}
			else if($(this).text()=="确定"){
				$("#waiting").show();
				if(permission.find("option:selected").text()==permission.find("span").text()){
					$("#waiting").hide();
					permission.find("select").remove();
					permission.children().show();
					$(this).text("编辑");
					$(this).next().text("删除");
				}
				else{
					var pms=permission.find("option:selected").text();
					var act=$(this).parent().siblings(".account").find("span").text();
					$.ajax({
						url:"manageAccount",
						type:"post",
						data:{"manage":"edit","account":act,"permission":pms},
						success:function(data){
							if(data.status=="success"){
								$("#waiting").hide();
								permission.find("select").remove();
								permission.find("span").text(pms).show();
								$(t).text("编辑");
								$(t).next().text("删除");
							}
						},
						error:function(){
							alert("error");
							permission.find("select").remove();
							permission.children().show();
							$(t).text("编辑");
							$(t).next().text("删除");
						}
					});
				}
			}
			else if($(this).text()=="取消"){
				permission.find("select").remove();
				permission.children().show();
				$(this).text("删除");
				$(this).prev().text("编辑");
			}
		});
		$("#full .account_manage .delete .button").click(function(){
			if($(this).text()=="确定"){
				$("#bottom").hide();
				$("#full>div>div").hide();
				$("#waiting").show();
				var act=$(this).closest("div").find("p span").text();
				$.ajax({
					url:"manageAccount",
					type:"post",
					data:{"manage":"delete","account":act},
					success:function(data){
							var len=$("#details .account_manage table table tr").length;
							for(var i=1;i<len;i++){
								if(act==$("#details .account_manage table table tr:eq("+i+")").find(".account span").text()){
									$("#details .account_manage table table tr:eq("+i+")").remove();
									break;
								}
							}
							$("#waiting").hide();
					},
					error:function(){}
				});
			}
		});
		$(".cancel,#bottom").click(function(){
			$("#bottom").hide();
			$("#full>div>div").hide();
		});
	//-----------------------my_account-----------------------
		//点击进入页面时发送ajax
			$("#top .my_account").click(function(){
				$("#details .my_account input").val("");
				$("#details .my_account p").text("");
				$.ajax({
					url:"managePassword",
					type:"post",
					data:{manage:"get"},
					success:function(data){
						$("#details .my_account .account").text(data.username);
					},
					error:function(){}
				});
			});
		//确定按钮
			$("#details .my_account .button").click(function(){
				if($(this).text()=="确定"){
					var pas1=$("#details .my_account input:eq(0)").val();
					var pas2=$("#details .my_account input:eq(1)").val();
					var pas3=$("#details .my_account input:eq(2)").val();
					if(pas2!=pas3){
						$("#details .my_account input:eq(1)").next().text("新密码两次输入不同！");
					}
					else if(flag[0]&&pas1&&!pas2){
						$("#details .my_account input:eq(1)").next().text("值为空");
						$("#details .my_account input:eq(2)").next().text("值为空");
					}
					else if(pas2&&!pas1){
						$("#details .my_account input:eq(0)").next().text("值为空");
					}
					else if(pas1&&pas1==pas2){
						$("#details .my_account input:eq(1)").next().text("新旧密码相同");
					}
					else if(flag[0]&&flag[1]&&flag[2]){
						var op=$("#details .my_account input:eq(0)").val();
						var np=$("#details .my_account input:eq(1)").val();
						$.ajax({
							url:"managePassword",
							type:"post",
							data:{manage:"change",oldpassword:op,newpassword:np},
							success:function(data){
								if(data.status=="success"){
									var form=document.createElement("form");
									form.method="get";
									form.action="/logout";
									form.submit();
								}
								else{
									$("#details .my_account input:eq(0)").next().text(data.status);
								}
							},
							error:function(){}
						});
					}
				}
			});
		//输入检测
			var flag=new Array();
			for(var i=0;i<3;i++){
				flag[i]=0;
			}
			var pattern1=/[^!-z]/,pattern2=/^[\u4e00-\u9fa5A-Za-z0-9_]+$/;
			var pi1=$("#details .my_account input:eq(0)"),pi2=$("#details .my_account input:eq(1)"),pi3=$("#details .my_account input:eq(2)");
			pi1.on({
				"input":function(){
					var str=$(this).val();
					if(pattern1.test(str)){
						$(this).next().text("字符有误");
						flag[0]=0;
					}
					else {
						$(this).next().text("");
						flag[0]=1;
						if(pi2.next().text()=="新旧密码相同"){
							pi2.next().text("");
						}
					}
				},
				"blur":function(){
					var str=$(this).val();
					if(str.length<8&&str.length>0){
						$(this).next().text("密码长度至少为8位");
						flag[0]=0;
					}
					else if(str.length==0){
						if(!pi2.val()&&!pi3.val()){
							pi2.next().text("");
							pi3.next().text("");
						}
						flag[0]=1;
					}
				}
			});
			pi2.on({"input":function(){checkPas1(1,this)},"blur":function(){checkPas2(1,this)}});
			pi3.on({"input":function(){checkPas1(2,this)},"blur":function(){checkPas2(2,this)}});
			function checkPas1(i,t){
				th=t;
				if(pi2.next().text()=="新密码两次输入不同！")
					pi2.next().text("");
				var str=$(th).val();
				if(pattern1.test(str)){
					$(th).next().text("字符有误");
					flag[i]=0;
				}
				else {
					$(th).next().text("");
					flag[i]=1;
				}
			 }
			function checkPas2(i,t){
				th=t;
				var str=$(th).val();
				if(str.length<8&&str.length>0){
					$(th).next().text("密码长度至少为8位");
					flag[i]=0;
				}
				if(str.length==0){
					flag[i]=1;
				}
				if(!pi2.val()&&!pi3.val()&&pi1.next().text()=="值为空"){
					pi1.next().text("");
				}
			}
	//-----------------------index_pic-----------------------
	//-----------------------index_phrase-----------------------
	//-----------------------products_pic-----------------------
	//-----------------------products_type-----------------------
		//点击进入页面时发送ajax
			$("#function .products_type").click(function(){
				$("#details .products_type .details1").hide();
				$("#details .products_type .details2").hide();
				$("#details .products_type .edit").hide();
				$.ajax({
					url:"getClassOne",
					type:"post",
					data:null,
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.classone.length;i++){
							option=document.createElement("option");
							option.text=data.classone[i];
							s.appendChild(option);
						}
						$("#details .products_type td.first_class").html(s);
						$("#details .products_type .details1").show();
						$("#details .products_type select:eq(0)").change();
					},
					error:function(){
						alert("页面获取失败");
					}
				});
			});
		//点击一级选项时发送ajax请求二级选项
			$("#details .products_type").delegate("select:eq(0)","change",function(){
				$("#details .products_type .edit").hide();
				if($("option:selected",this).text()=="请选择分类"){
					$("#details .products_type select:eq(1)").html("");
					return;
				}
				var fc=$("#details .products_type select:eq(0) option:selected").text();
				$.ajax({
					url:"getClassTwo",
					type:"post",
					data:{classone:fc},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.classtwo.length;i++){
							option=document.createElement("option");
							option.text=data.classtwo[i];
							s.appendChild(option);
						}
						$("#details .products_type td.second_class").html(s);
						$("#details .products_type .details2").show();
					},
					error:function(){
						alert("二级分类获取失败");
					}
				});
			});
		//点击二级选项时清空edit框
			$("#details .products_type").delegate("select:eq(1)","change",function(){
				$("#details .products_type .edit").hide();
			});
		//点击功能按钮
			$("#details .products_type .button").click(function(){
				var sclass=$(this).closest("tr").find("option:selected").text();
				if($(this).closest("tr").hasClass("first_class")){
					$("#details .products_type .edit").hide();
					if($(this).text()=="添加"){
						$("#details .products_type .add1 input").val("");
						$("#details .products_type .add1").show();
						$("#details .products_type .add1 input").select();
					}
					else if($(this).text()=="排序"){
						if($(this).closest("tr").find("option").length<3){
							return;
						}
						$("#bottom").show();
						var list="";
						for(var i=1;i<$(this).closest("tr").find("option").length;i++){
							var o=$(this).closest("tr").find("option:eq("+i+")").text();
							list+="<p><input type='radio' name='classname'><span>"+o+"</span></p>";
						}
						$("#full .products_type .sort1 div").html(list);
						$("#full .products_type .sort1").show();
					}
					else if(sclass!="请选择分类"){
						if($(this).text()=="删除"){
							$("#bottom").show();
							var fc=$(this).closest("tr").find("option:selected").text();
							$("#full .products_type .delete1 p span").text(fc);
							$("#full .products_type .delete1").show();
						}
						else if($(this).text()=="修改"){
							$("#details .products_type .alter1 input").val(sclass);
							$("#details .products_type .alter1").show();
							$("#details .products_type .alter1 input").select();
						}
					}
				}
				else if($(this).closest("tr").hasClass("second_class")){
					$("#details .products_type .edit").hide();
					if($(this).text()=="添加"){
						$("#details .products_type .add2 input").val("");
						$("#details .products_type .add2").show();
						$("#details .products_type .add2 input").select();
					}
					else if($(this).text()=="排序"){
						if($(this).closest("tr").find("option").length<3){
							return;
						}
						$("#bottom").show();
						var list="";
						for(var i=1;i<$(this).closest("tr").find("option").length;i++){
							var o=$(this).closest("tr").find("option:eq("+i+")").text();
							list+="<p><input type='radio' name='classname'><span>"+o+"</span></p>";
						}
						$("#full .products_type .sort2 div").html(list);
						$("#full .products_type .sort2").show();
					}
					else if(sclass!="请选择分类"){
						if($(this).text()=="删除"){
							$("#bottom").show();
							var fc=$(this).closest("tr").find("option:selected").text();
							$("#full .products_type .delete2 p span").text(fc);
							$("#full .products_type .delete2").show();
						}
						else if($(this).text()=="修改"){
							$("#details .products_type .alter2 input").val(sclass);
							$("#details .products_type .alter2").show();
							$("#details .products_type .alter2 input").select();
						}
					}
				}
			});
		//确定取消按钮
			$("#details .products_type .add1 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					//检查分类是否重复！
					var trop=$(this).closest("table").find("tr.first_class");
					if(!cn){
						return;
					}
					for(var i=1;i<trop.find("option").length;i++){
						if(trop.find("option:eq("+i+")").text()==cn){
							alert("分类名重复！");
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageClassOne",
						type:"post",
						data:{"manage":"add","classname":cn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type .edit").hide();
							$("#details .products_type td.first_class select").append("<option>"+cn+"</option>");
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_type .edit").hide();
				}
			});
			$("#details .products_type .add2 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					var fcn=$("#details .products_type tr.first_class option:selected").text();
					//检查分类是否重复！
					var trop=$(this).closest("table").find("tr.second_class");
					if(!cn){
						return;
					}
					for(var i=1;i<trop.find("option").length;i++){
						if(trop.find("option:eq("+i+")").text()==cn){
							alert("分类名重复！");
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageClassTwo",
						type:"post",
						data:{"manage":"add","classone":fcn,"classname":cn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type .edit").hide();
							$("#details .products_type td.second_class select").append("<option>"+cn+"</option>");
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_type .edit").hide();
				}
			});
			$("#details .products_type .alter1 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					//检查分类是否重复！
					var trop=$(this).closest("table").find("tr.first_class");
					var ocn=trop.find("option:selected").text();
					if(!cn){
						return;
					}
					for(var i=1;i<trop.find("option").length;i++){
						if(trop.find("option:eq("+i+")").text()==cn){
							$("#details .products_type .edit").hide();
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageClassOne",
						type:"post",
						data:{"manage":"edit","classname":cn,"oldname":ocn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type .edit").hide();
							trop.find("option:selected").text(cn);
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_type .edit").hide();
				}
			});
			$("#details .products_type .alter2 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					var fcn=$("#details .products_type tr.first_class option:selected").text();
					//检查分类是否重复！
					var trop=$(this).closest("table").find("tr.second_class");
					var ocn=trop.find("option:selected").text();
					if(!cn){
						return;
					}
					for(var i=1;i<trop.find("option").length;i++){
						if(trop.find("option:eq("+i+")").text()==cn){
							$("#details .products_type .edit").hide();
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageClassTwo",
						type:"post",
						data:{"manage":"edit","classone":fcn,"classname":cn,"oldname":ocn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type .edit").hide();
							trop.find("option:selected").text(cn);
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_type .edit").hide();
				}
			});
			$("#full .products_type .delete1 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("div").find("span.first_class").text();
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageClassOne",
						type:"post",
						data:{"manage":"delete","classname":cn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type tr.first_class option:selected").remove();
							$("#details .products_type select:eq(0)").change();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_type .delete2 .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("div").find("span.second_class").text();
					var fcn=$("#details .products_type tr.first_class option:selected").text();
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageClassTwo",
						type:"post",
						data:{"manage":"delete","classone":fcn,"classname":cn},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type tr.second_class option:selected").remove();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_type .sort1 .button").click(function(){
				if($(this).text()=="确定"){
					var list="";
					var s=document.createElement("select");
					var option=document.createElement("option");
					option.text="请选择分类";
					s.appendChild(option);
					for(var i=0;i<$(this).closest("div").find("div span").length;i++){
						if(i!=0){
							list+="#";
						}
						var option=document.createElement("option");
						option.text=$(this).closest("div").find("div span:eq("+i+")").text();
						list+=option.text;
						s.appendChild(option);
					}
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageClassOne",
						type:"post",
						data:{"manage":"sort","sequence":list},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type td.first_class").html(s);
							$("#details .products_type select:eq(0)").change();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_type .sort2 .button").click(function(){
				if($(this).text()=="确定"){
					var fcn=$("#details .products_type tr.first_class option:selected").text();
					var list="";
					var s=document.createElement("select");
					var option=document.createElement("option");
					option.text="请选择分类";
					s.appendChild(option);
					for(var i=0;i<$(this).closest("div").find("div span").length;i++){
						if(i!=0){
							list+="#";
						}
						var option=document.createElement("option");
						option.text=$(this).closest("div").find("div span:eq("+i+")").text();
						list+=option.text;
						s.appendChild(option);
					}
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageClassTwo",
						type:"post",
						data:{"manage":"sort","classone":fcn,"sequence":list},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_type td.second_class").html(s);
						},
						error:function(){}
					});
				}
			});
		//排序上下按钮
			$("#full .products_type .up").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.prev().is("p")){
					checked.prev().before(s);
					var newChecked=checked.prev().prev();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .products_type .down").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.next().is("p")){
					checked.next().after(s);
					var newChecked=checked.next().next();
					newChecked.find("input").click();
					checked.remove();
				}
			});
	//-----------------------products_details-----------------------
		//点击进入页面时发送ajax
			$("#function .products_details").click(function(){
				$("#details .products_details .click_edit").show();
				$("#details .products_details select:eq(1)").html("");
				$("#details .products_details select:eq(2)").html("");
				$("#details .products_details .details").hide();
				$("#details .edit_box").remove();
				$.ajax({
					url:"getClassOne",
					type:"post",
					data:null,
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.classone.length;i++){
							var option=document.createElement("option");
							option.text=data.classone[i];
							s.appendChild(option);
						}
						$("#details .products_details select:eq(0)").html(s.innerHTML);
					},
					error:function(){
						//alert("页面获取失败");
					}
				});
			});
		//点击一级选项时发送ajax请求二级选项
			$("#details .products_details").delegate("select:eq(0)","change",function(){
				$("#details .products_details .details").hide();
				if($("option:selected",this).text()=="请选择分类"){
					$("#details .products_details select:eq(1)").html("");
					$("#details .products_details select:eq(2)").html("");
					return;
				}
				var fc=$("option:selected",this).text();
				$.ajax({
					url:"getClassTwo",
					type:"post",
					data:{classone:fc},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.classtwo.length;i++){
							option=document.createElement("option");
							option.text=data.classtwo[i];
							s.appendChild(option);
						}
						$("#details .products_details select:eq(1)").html(s.innerHTML);
						$("#details .products_details select:eq(2)").html("");
					},
					error:function(){
						//alert("二级分类获取失败");
					}
				});
			});
		//点击二级选项时发送ajax请求对应产品
			$("#details .products_details").delegate("select:eq(1)","change",function(){
				$("#details .products_details .details").hide();
				if($("option:selected",this).text()=="请选择分类"){
					$("#details .products_details select:eq(2)").html("");
					return;
				}
				var fc=$("#details .products_details select:eq(0) option:selected").text();
				var sc=$("option:selected",this).text();
				$.ajax({
					url:"getProduct",
					type:"post",
					data:{classone:fc,classtwo:sc},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择产品";
						s.appendChild(option);
						for(var i=0;i<data.products.length;i++){
							option=document.createElement("option");
							option.text=data.products[i];
							s.appendChild(option);
						}
						$("#details .products_details select:eq(2)").html(s.innerHTML);
						$("#details .products_details .series .details").show();
					},
					error:function(){
						//alert("二级分类获取失败");
					}
				});
			});
		//点击三级选项时发送ajax请求产品详细数据
			$("#details .products_details").delegate("select:eq(2)","change",function(){
				$("#details .products_details .click_edit").show();
				$("#details .edit_box").remove();
				$("#details .products_details .edit").hide();
				$("#details .products_details .series .details").show();
				$("#details .products_details #select_spec option:eq(0)").attr({"selected":true});
				$("#details .products_details #select_spec").change();
				if($("option:selected",this).text()=="请选择产品"){
					$("#details .products_details .details").hide();
					return;
				}
				var classone=$("#details .products_details select:eq(0) option:selected").text();
				var classtwo=$("#details .products_details select:eq(1) option:selected").text();
				var product=$("#details .products_details select:eq(2) option:selected").text();
				$.ajax({
					url:"getProductInfo",
					type:"post",
					data:{"classone":classone,"classtwo":classtwo,"product":product},
					success:function(data){
						if(data.content){
							$("#details .products_details .save_table").html(data.content);
						}
						else{
							var tablehtml="<table border='1'><tr class='table_title'><td colspan='4'>主体</td></tr><tr class='table_title'><td colspan='4'>功能</td></tr><tr class='table_title'><td colspan='4'>规格</td></tr></table>";
							$("#details .products_details .save_table").html(tablehtml);
						}
						var s="";
						for(var i=0;i<data.productpic.length;i++){
							var div=document.createElement("div");
							var img=document.createElement("img");
							img.src=data.productpic[i];
							var input=document.createElement("input");
							input.type="checkbox";
							div.appendChild(img);
							div.appendChild(input);
							s+=div.outerHTML+"\n";
						}
						$("#details .products_details .products_pics").html(s);
						if(data.productinfo.length==0){
							$("#details .products_details .article div:eq(0)").html('<p> </p><p><br></p>');
						}
						else{
							$("#details .products_details .article div:eq(0)").html(data.productinfo);
						}
						$("#details input[type='file']").prop("outerHTML","<input type='file' accept='image/*'>");
						$("#details .products_details .details").show();
					},
					error:function(){}
				});
			});
		//点击参数分类时从html的表格中抽出数据重组成分类下的参数表格
			$("#select_spec").change(function(){
				var sclass=$("option:selected",this).text();
				if(sclass!="选择参数分类"){
					var s="<tr><td><span>参数类型</span></td><td><span>具体描述</span></td><td><span>操作</span></td></tr>";
					var table=$("#details .products_details .save_table table");
					var count1=0,count2=0,flag=0;
					for(var i=0;i<table.find("tr").length;i++){
						var tr=table.find("tr:eq("+i+")");
						if(tr.hasClass("table_title")){
							if(tr.find("td:eq(0)").text()==sclass){
								count1=i;
								flag=1;
							}
							else if(flag==1){
								count2=i;
								break;
							}
						}
					}
					if(count2==0){
						count2=table.find("tr").length;
					}
					var spec=new Array();
					var value=new Array();
					for(var i=count1+1;i<count2;i++){
						var j=i-count1-1;
						spec[j]=table.find("tr:eq("+i+") td:eq(0)").text();
						value[j]=table.find("tr:eq("+i+") td:eq(1)").text();
					}
					for(var i=0;i<count2-count1-1;i++){
						s+="<tr class='spec_tr'><td><span class='spec1'>"+spec[i]+"</span><input class='spec2' type='text'></td><td><span class='spec1'>"+value[i]+"</span><input class='spec2' type='text'></td><td><span class='button spec1'>修改</span><span class='button spec1'>删除</span><span class='button spec2'>确定</span><span class='button spec2'>取消</span></td></tr>";
					}
					s+="<tr class='edit add_spec'><td><input type='text'></td><td><input type='text'></td><td><span class='button'>确定</span><span class='button'>取消</span></td></tr>";
					s+="<tr class='add_sort'><td></td><td></td><td><span class='button'>添加</span><span class='button'>排序</span></td></tr>";
					$("#details .products_details .spec_table").html(s);
					$(this).siblings("table").show();
				}
				else{
					$(this).siblings("table").hide();
				}
			});
		//点击功能按钮
			$("#details .products_details .series .button").click(function(){
				var sclass=$(this).closest("tr").find("option:selected").text();
				if($(this).closest("tr").hasClass("series")){
					$("#details .products_details .edit").hide();
					if($(this).text()=="添加"){
						$("#details .products_details .add_product input").val("");
						$("#details .products_details .add_product").show();
						$("#details .products_details .add_product input:eq(0)").select();
					}
					else if($(this).text()=="排序"){
						if($(this).closest("tr").find("option").length<3){
							return;
						}
						$("#bottom").show();
						var list="";
						for(var i=1;i<$(this).closest("tr").find("option").length;i++){
							var o=$(this).closest("tr").find("option:eq("+i+")").text();
							list+="<p><input type='radio' name='series'><span>"+o+"</span></p>";
						}
						$("#full .products_details .sort1 div").html(list);
						$("#full .products_details .sort1").show();
					}
					else if(sclass!="请选择产品"){
						if($(this).text()=="删除"){
							$("#bottom").show();
							var fc=$(this).closest("tr").find("option:selected").text();
							$("#full .products_details .delete1 p span").text(fc);
							$("#full .products_details .delete1").show();
						}
						else if($(this).text()=="编辑"){
							$("#details .products_details .edit_product input:eq(0)").val(sclass.replace(/_.+/,""));
							$("#details .products_details .edit_product input:eq(1)").val(sclass.replace(/.+_/,""));
							$("#details .products_details .edit_product").show();
							$("#details .products_details .edit_product input:eq(0)").select();
						}
					}
				}
			});
			$("#details .products_details .edit_pic .button").click(function(){
				$("#details .products_details .edit").hide();
				if($(this).text()=="添加"){
					if($("#details .products_details .products_pics img").length>7){
						alert("一个产品最多8张图片");
						return;
					}
					$("#details .products_details .add_pic").show();
				}
				else if($(this).text()=="删除"){
					var pic_name=new Array();
					var list="";
					var len=$("#details .products_details .products_pics").find("input:checked").length;
					if(len==0){
						return;
					}
					for(var i=0;i<len;i++){
						if(i!=0){
							list+=" ";
						}
						pic_name[i]=$("#details .products_details .products_pics").find("input:checked:eq("+i+")").prev().attr('src').replace(/.+\//,"");
						list+=pic_name[i];
					}
					$("#full .products_details .delete2 p span").text("选中的");
					$("#bottom").show();
					$("#full .products_details .delete2").show();
				}
				else if($(this).text()=="排序"){
					if($("#details .products_details .products_pics img").length<2){
						return;
					}
					$("#bottom").show();
					var list="";
					for(var i=0;i<$("#details .products_details .products_pics img").length;i++){
						var o=$("#details .products_details .products_pics img:eq("+i+")").attr('src');
						list+="<div><img src='"+o+"'><input type='radio' name='pic'></div>\n";
					}
					$("#full .products_details .sort2 div").html(list);
					$("#full .products_details .sort2").show();
				}
			});
			$("#details .products_details .edit_spec").delegate(".button","click",function(){
				if($(this).text()=="使用同类型产品模版"){
					if($("#details .products_details select:eq(2)").get(0).selectedIndex==1){
						alert("该产品已是模版");
						return;
					}
					$("#bottom").show();
					$("#full .products_details .template").show();
				}
				else if($(this).siblings("select").find("option:selected").text()=="选择参数分类"){
					return;
				}
				else if($(this).text()=="添加"){
					$("#details .products_details .edit").hide();
					$("#details .products_details .add_sort").hide();
					$("#details .products_details .spec_table .spec2").hide();
					$("#details .products_details .spec_table .spec1").show();
					$("#details .products_details .add_spec").show();
					$("#details .products_details .add_spec input:eq(0)").select();
				}
				else if($(this).text()=="排序"){
					if($(this).closest("table").find("tr").length<5){
						return;
					}
					$("#bottom").show();
					var list="";
					for(var i=1;i<$(this).closest("table").find("tr").length-2;i++){
						var spec=$(this).closest("table").find("tr:eq("+i+") td:eq(0) span").text();
						var value=$(this).closest("table").find("tr:eq("+i+") td:eq(1) span").text();
						list+="<p><input type='radio' name='series'><span>"+spec+"</span> <span>"+value+"</span></p>";
					}
					$("#full .products_details .sort3 div").html(list);
					$("#full .products_details .sort3").show();
				}
				else if($(this).text()=="删除"){
					$("#bottom").show();
					var s=$(this).closest("tr").find("span.spec1:eq(0)").text();
					$("#full .products_details .delete3 .spec_name").text(s);
					$("#full .products_details .delete3").show();
				}
				else if($(this).text()=="修改"){
					$("#details .products_details .edit").hide();
					$("#details .products_details .add_sort").show();
					$(this).closest("tr").find(".spec1").hide();
					$(this).closest("tr").find(".spec2:eq(0)").val($(this).closest("tr").find(".spec1:eq(0)").text());
					$(this).closest("tr").find(".spec2:eq(1)").val($(this).closest("tr").find(".spec1:eq(1)").text()).select();
					$(this).closest("tr").find(".spec2").show();
					$(this).closest("tr").find(".spec2:eq(1)").select();
				}
			});
		//确定取消按钮
			$("#details .products_details").delegate(".button","click",function(){
				if($(this).text()=="取消"){
					$("#details .products_details .edit").hide();
					if($(this).hasClass("spec2")){
						$(this).closest("tr").find(".spec2").hide();
						$(this).closest("tr").find(".spec1").show();
					}
					else if($(this).closest("tr").hasClass("add_spec")){
					$("#details .products_details .add_sort").show();
					}
				}
			});
			$("#details .products_details .add_product .button").click(function(){
				if($(this).text()=="确定"){
					var val1=$(this).closest("tr").find("input:eq(0)").val().replace(/\_|\s/g,"");
					var val2=$(this).closest("tr").find("input:eq(1)").val().replace(/\_|\s/g,"");
					if(!val1||!val2){
						return;
					}
					var s=val1;
					s+="_"+val2;
					for(var i=1;i<$("#details .products_details select:eq(2) option").length;i++){
						if(s==$("#details .products_details select:eq(2) option:eq("+i+")").text()){
							alert("产品名字重复！");
							return;
						}
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					$("#waiting").show();
					$.ajax({
						url:"manageProduct",
						type:"post",
						data:{manage:"add",classone:fc,classtwo:sc,productname:s},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_details select:eq(2)").append("<option>"+s+"</option>");
							$("#details .products_details .edit").hide();
						},
						error:function(){}
					});
				}
			});
			$("#details .products_details .edit_product .button").click(function(){
				if($(this).text()=="确定"){
					var val1=$(this).closest("tr").find("input:eq(0)").val().replace(/\_|\s/g,"");
					var val2=$(this).closest("tr").find("input:eq(1)").val().replace(/\_|\s/g,"");
					if(!val1||!val2){
						return;
					}
					var s=val1;
					s+="_"+val2;
					var os=$("#details .products_details select:eq(2) option:selected").text();
					for(var i=1;i<$("#details .products_details select:eq(2) option").length;i++){
						if(s==$("#details .products_details select:eq(2) option:eq("+i+")").text()){
							alert("产品名字重复！");
							return;
						}
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					$("#waiting").show();
					$.ajax({
						url:"manageProduct",
						type:"post",
						data:{manage:"edit",classone:fc,classtwo:sc,productname:s,oldname:os},
						success:function(data){
							$("#details .products_details .edit").hide();
							for(var i=1;i<$("#details .products_details select:eq(2) option").length;i++){
								if(os==$("#details .products_details select:eq(2) option:eq("+i+")").text()){
									$("#details .products_details select:eq(2) option:eq("+i+")").text(s);
								}
							}
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_details .delete1 .button").click(function(){
				if($(this).text()=="确定"){
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var s=$(this).siblings("p").find(".product_name").text();
					$("#bottom").hide();
					$("#full .products_details .delete1").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageProduct",
						type:"post",
						data:{manage:"delete",classone:fc,classtwo:sc,productname:s},
						success:function(data){
							for(var i=1;i<$("#details .products_details select:eq(2) option").length;i++){
								if(s==$("#details .products_details select:eq(2) option:eq("+i+")").text()){
									$("#details .products_details select:eq(2) option:eq("+i+")").remove();
								}
							}
							$("#details .products_details .details").hide();
							$("#details .products_details .series .details").show();
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_details .sort1 .button").click(function(){
				if($(this).text()=="确定"){
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var list="";
					var s=document.createElement("select");
					var option=document.createElement("option");
					option.text="请选择分类";
					s.appendChild(option);
					for(var i=0;i<$(this).closest("div").find("div span").length;i++){
						if(i!=0){
							list+="#";
						}
						var option=document.createElement("option");
						option.text=$(this).closest("div").find("div span:eq("+i+")").text();
						list+=option.text;
						s.appendChild(option);
					}
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageProduct",
						type:"post",
						data:{manage:"sort",classone:fc,classtwo:sc,sequence:list},
						success:function(data){
							$("#waiting").hide();
							$("#details .products_details select:eq(2)").html(s.innerHTML);
							$("#details .products_details .details").hide();
							$("#details .products_details .series .details").show();
						},
						error:function(){}
					});
				}
			});
			$("#details .products_details .add_pic .button").click(function(){
				if($(this).text()=="确定"){
					if($("#details .products_details .products_pics img").length>7){
						alert("一个产品最多8张图片");
						return;
					}
					var file=this.previousSibling;
					if(/image/.test(file.files[0].type)){
						if(file.files[0].name.length>=28){
							alert("文件名过长");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						if(file.files[0].size/1024>1024){
							alert("图片太大，请限制在1M以内");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=file.files[0].name.replace(/.+\./,"");
						if(s.toLowerCase()!=s){
							alert("请把图片后缀名改为小写");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var fc=$("#details .products_details select:eq(0) option:selected").text();
						var sc=$("#details .products_details select:eq(1) option:selected").text();
						var pname=$("#details .products_details select:eq(2) option:selected").text();
						var formdata=new FormData();
						formdata.append("manage","add");
						formdata.append("pic",file.files[0]);
						formdata.append("classone",fc);
						formdata.append("classtwo",sc);
						formdata.append("productname",pname);
						var t=this;
						$("#waiting").show();
						$.ajax({
							url:"manageProductPic",
							type:"post",
							contentType:false,
							processData:false,
							data:formdata,
							success:function(data){
								var div=document.createElement("div");
								var img=document.createElement("img");
								img.src=data.picname;
								var input=document.createElement("input");
								input.type="checkbox";
								div.appendChild(img);
								div.appendChild(input);
								$("#details .products_details .products_pics").append(div).append("\n");
								$(t).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else{
						alert("请选择图片文件");
					}
				}
				else if($(this).text()=="取消"){
					$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
				}
			});
			$("#full .products_details .delete2 .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					var ppname=new Array();
					for(var i=0;i<$("#details .products_details .products_pics").find("input:checked").length;i++){
						ppname[i]=$("#details .products_details .products_pics").find("input:checked:eq("+i+")").prev().attr('src').replace(/.+\//,"");
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var pname=$("#details .products_details select:eq(2) option:selected").text();
					//var ppname=$(this).siblings("p").find(".pic_name").text();
					//ppname=ppname.replace(/\s/g,"\",\"");
					//ppname="[\""+ppname+"\"]";
					$.ajax({
						url:"manageProductPic",
						type:"post",
						data:{manage:"delete",picname:ppname,classone:fc,classtwo:sc,productname:pname},
						success:function(data){
							var len=$("#details .products_details .products_pics").find("input:checked").length;
							for(var i=0;i<len;i++){
								$("#details .products_details .products_pics").find("input:checked:eq(0)").parent().remove();
							}
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#full .products_details .sort2 .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					var s=$(this).siblings("div").html();
					var list="";
					for(var i=0;i<$("#details .products_details .products_pics img").length;i++){
						if(i!=0){
							list+="#";
						}
						list+=$(this).siblings("div").find("img:eq("+i+")").attr('src').replace(/.+\//,"");
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var pname=$("#details .products_details select:eq(2) option:selected").text();
					$.ajax({
						url:"manageProductPic",
						type:"post",
						data:{manage:"sort",sequence:list,classone:fc,classtwo:sc,productname:pname},
						success:function(data){
							$("#details .products_details .products_pics").html(s);
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#details .products_details .edit_spec").delegate(".button","click",function(){
				if($(this).text()=="确定"){
					if($(this).hasClass("spec2")){
						var t=this;
						var ospec=$(this).closest("tr").find(".spec1:eq(0)").text();
						var ovalue=$(this).closest("tr").find(".spec1:eq(1)").text();
						var spec=$(this).closest("tr").find(".spec2:eq(0)").val();
						var value=$(this).closest("tr").find(".spec2:eq(1)").val();
						var otable=$("#details .products_details .save_table").html();
						var table=$("#details .products_details .save_table table");
						if(ospec!=spec){
							for(var i=0;i<table.find("tr").length;i++){
								if(table.find("tr:eq("+i+") td:eq(0)").text()==spec){
									alert("参数类型重复！");
									return;
								}
							}
						}
						for(var i=0;i<table.find("tr").length;i++){
							if(table.find("tr:eq("+i+") td:eq(0)").text()==ospec){
								table.find("tr:eq("+i+") td:eq(0)").text(spec);
								table.find("tr:eq("+i+") td:eq(1)").text(value);
								break;
							}
						}
						var fc=$("#details .products_details select:eq(0) option:selected").text();
						var sc=$("#details .products_details select:eq(1) option:selected").text();
						var pname=$("#details .products_details select:eq(2) option:selected").text();
						var s=$("#details .products_details .save_table").html();
						$("#waiting").show();
						$.ajax({
							url:"manageProductInfo",
							type:"post",
							data:{classone:fc,classtwo:sc,productname:pname,content:s},
							success:function(data){
								if(data.status=="success"){
									$(t).closest("tr").find(".spec1:eq(0)").text(spec);
									$(t).closest("tr").find(".spec1:eq(1)").text(value);
									$("#details .products_details .spec2").hide();
									$("#details .products_details .spec1").show();
									$("#waiting").hide();
								}
								else{
									$("#details .products_details .save_table").html(otable);
								}
							},
							error:function(){
								//$("#details .products_details .save_table").html(otable);
							}
						});
					}
					else if($(this).closest("tr").hasClass("add_spec")){
						if($(this).closest("tr").prev().hasClass("spec_tr")){
							var mark=$(this).closest("tr").prev().find(".spec1:eq(0)").text();
						}
						else{
							mark=$("#select_spec option:selected").text();
						}
						var spec=$(this).closest("tr").find("input:eq(0)").val();
						if(!spec){
							return;
						}
						var value=$(this).closest("tr").find("input:eq(1)").val();
						var s="<tr class='table_child'><td width='25%'>"+spec+"</td><td colspan='3'>"+value+"</td></tr>";
						var otable=$("#details .products_details .save_table").html();
						var table=$("#details .products_details .save_table table");
						var len=table.find("tr").length;
						for(var i=0;i<table.find("tr").length;i++){
							if(table.find("tr:eq("+i+") td:eq(0)").text()==spec){
								alert("参数类型重复！");
								return;
							}
						}
						for(var i=0;i<len;i++){
							if(table.find("tr:eq("+i+") td:eq(0)").text()==mark){
								table.find("tr:eq("+i+")").after(s);
								break;
							}
						}
						var fc=$("#details .products_details select:eq(0) option:selected").text();
						var sc=$("#details .products_details select:eq(1) option:selected").text();
						var pname=$("#details .products_details select:eq(2) option:selected").text();
						s=$("#details .products_details .save_table").html();
						$("#waiting").show();
						$.ajax({
							url:"manageProductInfo",
							type:"post",
							data:{classone:fc,classtwo:sc,productname:pname,content:s},
							success:function(data){
								if(data.status=="success"){
									var title=$("#details .products_details select:eq(3) option:selected").text();
									$("#details .products_details select:eq(3)").change();
									$("#waiting").hide();
								}
								else{
									$("#details .products_details .save_table").html(otable);
								}
							},
							error:function(){
								//$("#details .products_details .save_table").html(otable);
							}
						});
					}
				}
			});
			$("#full .products_details .delete3 .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					var spec=$(this).closest("div").find(".spec_name").text();
					var otable=$("#details .products_details .save_table").html();
					var table=$("#details .products_details .save_table table");
					for(var i=0;i<table.find("tr").length;i++){
						if(table.find("tr:eq("+i+") td:eq(0)").text()==spec){
							table.find("tr:eq("+i+")").remove();
							break;
						}
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var pname=$("#details .products_details select:eq(2) option:selected").text();
					var s=$("#details .products_details .save_table").html();
					$.ajax({
						url:"manageProductInfo",
						type:"post",
						data:{classone:fc,classtwo:sc,productname:pname,content:s},
						success:function(data){
							if(data.status=="success"){
								var title=$("#details .products_details select:eq(3) option:selected").text();
								$("#details .products_details select:eq(3)").change();
								$("#waiting").hide();
							}
							else{
								$("#details .products_details .save_table").html(otable);
							}
						},
						error:function(){
							//$("#details .products_details .save_table").html(otable);
						}
					});
				}
			});
			$("#full .products_details .sort3 .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					var spec=new Array();
					var value=new Array();
					for(var i=0;i<$(this).siblings("div").find("p").length;i++){
						var p=$(this).siblings("div").find("p:eq("+i+")");
						spec[i]=p.find("span:eq(0)").text();
						value[i]=p.find("span:eq(1)").text();
					}
					var title=$("#details .products_details select:eq(3) option:selected").text();
					var otable=$("#details .products_details .save_table").html();
					var table=$("#details .products_details .save_table table");
					for(var i=0;i<table.find("tr").length;i++){
						if(table.find("tr:eq("+i+") td:eq(0)").text()==title){
							var len=spec.length+i+1;
							for(var j=i+1;j<len;j++){
								table.find("tr:eq("+j+") td:eq(0)").text(spec[j-i-1]);
								table.find("tr:eq("+j+") td:eq(1)").text(value[j-i-1]);
							}
							break;
						}
					}
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var pname=$("#details .products_details select:eq(2) option:selected").text();
					var s=$("#details .products_details .save_table").html();
					$.ajax({
						url:"manageProductInfo",
						type:"post",
						data:{classone:fc,classtwo:sc,productname:pname,content:s},
						success:function(data){
							if(data.status=="success"){
								$("#details .products_details select:eq(3)").change();
								$("#waiting").hide();
							}
							else{
								$("#details .products_details .save_table").html(otable);
							}
						},
						error:function(){
							//$("#details .products_details .save_table").html(otable);
						}
					});
				}
			});
			$("#full .products_details .template .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full .products_details .template").hide();
					$("#waiting").show();
					var fc=$("#details .products_details select:eq(0) option:selected").text();
					var sc=$("#details .products_details select:eq(1) option:selected").text();
					var s=$("#details .products_details select:eq(2) option:eq(1)").text();
					var pname=$("#details .products_details select:eq(2) option:selected").text();
					$.ajax({
						url:"getProductInfo",
						type:"post",
						data:{"classone":fc,"classtwo":sc,"product":s},
						success:function(data){
							if(data.content){
								$("#details .products_details .save_table").html(data.content);
								var len=$("#details .products_details .save_table tr").length;
								for(var i=0;i<len;i++){
									$("#details .products_details .save_table tr").eq(i).find("td:eq(1)").text("");
								}
							}
							else{
								var tablehtml="<table border='1'><tr class='table_title'><td colspan='4'>主体</td></tr><tr class='table_title'><td colspan='4'>功能</td></tr><tr class='table_title'><td colspan='4'>规格</td></tr></table>";
								$("#details .products_details .save_table").html(tablehtml);
							}
							var newtable=$("#details .products_details .save_table").html();
							$.ajax({
								url:"manageProductInfo",
								type:"post",
								data:{classone:fc,classtwo:sc,productname:pname,content:newtable},
								success:function(data){
									$("#select_spec").change();
									$("#waiting").hide();
								},
								error:function(){}
							});
						},
						error:function(){}
					});
				}
			});
		//排序上下按钮
			$("#full .products_details .up").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.prev().is("p")){
					checked.prev().before(s);
					var newChecked=checked.prev().prev();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .products_details .down").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.next().is("p")){
					checked.next().after(s);
					var newChecked=checked.next().next();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .products_details .left").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.prev().is("div")){
					checked.prev().before(s+"\n");
					var newChecked=checked.prev().prev();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .products_details .right").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.next().is("div")){
					checked.next().after("\n"+s);
					var newChecked=checked.next().next();
					newChecked.find("input").click();
					checked.remove();
				}
			});
		//文章编辑框
			$("#details .products_details .click_edit").click(function(){
				var s=$(this).prev().html();
				if(s.replace(/\s/g,"").length!=0){
					$("#text_box").html(s);
				}
			});
			var range;
			$("#details").delegate("#text_box","blur",function(){
				range=window.getSelection().getRangeAt(0);
			});
			$("#details").delegate(".edit_function span:eq(0)","click",function(){
				if(range){
					$("#file").click();
				}
			});
			$(window).scroll(function(){
				if(!sTop){
					return;
				}
				//$("#rec_nav2").stop();
				var wScrollTop=$(window).scrollTop()+90;
				var r=wScrollTop-sTop;
				if(r>0){
					$("#details .products_details .edit_function").offset({top:wScrollTop});
					$("#details .stores_show .edit_function").offset({top:wScrollTop});
					$("#details .engineering_show .edit_function").offset({top:wScrollTop});
				}
				else{
					$("#details .products_details .edit_function").offset({top:sTop});
					$("#details .stores_show .edit_function").offset({top:sTop});
					$("#details .engineering_show .edit_function").offset({top:sTop});
				}
			});
			$("#details .products_details").delegate("#file","change",function(){
				var file=document.getElementById("file");
				var picform=document.getElementById("picform");
				var fc=$("#details .products_details select:eq(0) option:selected").text();
				var sc=$("#details .products_details select:eq(1) option:selected").text();
				var pname=$("#details .products_details select:eq(2) option:selected").text();
				if(/image/.test(file.files[0].type)){
					if(file.files[0].name.length>=28){
						picform.reset();
						alert("文件名过长");
						return;
					}
					if(file.files[0].size/1024>1024){
						picform.reset();
						alert("图片太大，请限制在1M以内");
						return;
					}
					var s=file.files[0].name.replace(/.+\./,"");
					if(s.toLowerCase()!=s){
						picform.reset();
						alert("请把图片后缀名改为小写");
						return;
					}
					var formdata=new FormData();
					formdata.append("pic",file.files[0]);
					formdata.append("classone",fc);
					formdata.append("classtwo",sc);
					formdata.append("productname",pname);
					$.ajax({
						url:"saveProductInfoPic",
						type:"POST",
						contentType:false,
						processData:false,
						data:formdata,
						success:function(data){
							if(data.picname){
								var img=document.createElement("img");
								img.src=data.picname;
								range.insertNode(img);
								range.setStartAfter(img);
								img.onload=function(){
									var t=$('#text_box').get(0);
									var h=document.body.scrollTop;
									t.style.height=0+"px";
									if(t.scrollHeight>300){
										t.style.height=t.scrollHeight+50+"px";
										heightMark=t.scrollHeight;
									}
									else{
										t.style.height=t.scrollHeight+"px";
									}
								}
							}
							else{
								alert("图片返回失败");
							}
						},
						error:function(){
							alert("图片上传失败");
						}
					});
				}
				else{
					alert("请选择图片文件");
				}
        		picform.reset();
			});
			$("#details .products_details").delegate(".pub","click",function(){
				var fc=$("#details .products_details select:eq(0) option:selected").text();
				var sc=$("#details .products_details select:eq(1) option:selected").text();
				var pname=$("#details .products_details select:eq(2) option:selected").text();
				var text=$("#details .products_details #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"saveProductInfo",
					type:"post",
					data:{productinfo:text,classone:fc,classtwo:sc,productname:pname},
					success:function(data){
						$("#details .products_details .article div:eq(0)").html(text);
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------products_susume-----------------------
		//点击进入页面时发送ajax
			$("#function .products_susume").click(function(){
				$("#details .products_susume .details").hide();
				$.ajax({
					url:"getClassOne",
					type:"post",
					data:null,
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.classone.length;i++){
							var option=document.createElement("option");
							option.text=data.classone[i];
							s.appendChild(option);
						}
						$("#details .products_susume select:eq(0)").html(s.innerHTML);
					},
					error:function(){}
				});
			});
		//点击一级选项时发送ajax请求推荐产品
			$("#details .products_susume select:eq(0)").change(function(){
				var sclass=$("option:selected",this).text();
				$("#details .products_susume .details").hide();
				if(sclass!="请选择分类"){
					$.ajax({
						url:"manageBestProducts",
						type:"post",
						data:{"manage":"get","classone":sclass},
						success:function(data){
							var s="<tr><td><span>一级分类</span></td><td><span>二级分类</span></td><td><span>系列型号</span></td><td><span>操作</span></td></tr>";
							var count=0;
							for(var i=0;i<data.products.length;i++){
								var classtwo=data.products[i].replace(/\#.+/,"");
								var series=data.products[i].replace(/.+\#/,"").replace(/\_/," ");
								s+="<tr><td>"+sclass+"</td><td>"+classtwo+"</td><td>"+series+"</td><td><span class='button'>删除</span></td></tr>";
								count=i;
							}
							s+="<tr class='add1'><td></td><td></td><td></td><td><span class='button'>添加</span></td></tr>"
							s+="<tr class='add2'><td>"+sclass+"</td><td><select></select></td><td><select></select></td><td><span class='button'>确定</span><span class='button'>取消</span></td></tr>";
							$('#details .products_susume .details').html(s).show();
							if(count<3){
								$("#details .products_susume .details .add1").show();
							}
							var select=document.createElement("select");
							var option=document.createElement("option");
							option.text="请选择分类";
							select.appendChild(option);
							for(var i=0;i<data.classtwo.length;i++){
								option=document.createElement("option");
								option.text=data.classtwo[i];
								select.appendChild(option);
							}
							$("#details .products_susume select:eq(1)").html(select.innerHTML);
						},
						error:function(){}
					});
				}
			});
		//点击二级选项时发送ajax请求对应产品
			$("#details .products_susume").delegate("select:eq(1)","change",function(){
				if($("option:selected",this).text()=="请选择分类"){
					$("#details .products_susume select:eq(2)").html("");
					return;
				}
				var fc=$("#details .products_susume select:eq(0) option:selected").text();
				var sc=$("option:selected",this).text();
				$.ajax({
					url:"getProduct",
					type:"post",
					data:{classone:fc,classtwo:sc},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择产品";
						s.appendChild(option);
						for(var i=0;i<data.products.length;i++){
							option=document.createElement("option");
							option.text=data.products[i];
							s.appendChild(option);
						}
						$("#details .products_susume select:eq(2)").html(s.innerHTML);
					},
					error:function(){
						//alert("二级分类获取失败");
					}
				});
			});
		//点击功能按钮
			$("#details .products_susume").delegate(".button","click",function(){
				if($(this).text()=="添加"){
					$("#details .products_susume .details .add1").hide();
					$("#details .products_susume select:eq(1) option:eq(0)").attr("selected","true");
					$("#details .products_susume select:eq(1)").change();
					$("#details .products_susume .details .add2").show();
				}
				else if($(this).text()=="删除"){
					var classone=$(this).closest("tr").find("td:eq(0)").text();
					var classtwo=$(this).closest("tr").find("td:eq(1)").text();
					var pname=$(this).closest("tr").find("td:eq(2)").text();
					var number=$("#details .products_susume .details tr").index($(this).parent().parent());
					$("#bottom").show();
					$("#full .products_susume .delete .product_name").text(classone+" "+classtwo+" "+pname);
					pname=pname.replace(/\s/,"_");
					$("#full .products_susume .delete .fc").text(classone);
					$("#full .products_susume .delete .sc").text(classtwo);
					$("#full .products_susume .delete .pname").text(pname);
					$("#full .products_susume .delete .number").text(number);
					$("#full .products_susume .delete").show();
				}
			});
		//确定取消按钮
			$("#details .products_susume").delegate(".button","click",function(){
				if($(this).text()=="确定"){
					var fc=$("#details .products_susume select:eq(0) option:selected").text();
					var sc=$("#details .products_susume select:eq(1) option:selected").text();
					var pname=$("#details .products_susume select:eq(2) option:selected").text();
					if(sc=="请选择分类"||pname=="请选择产品"){
						alert("尚未选择产品！");
						return;
					}
					var len=$("#details .products_susume table table tr").length-2;
					for(var i=1;i<len;i++){
						var td1=$("#details .products_susume table table tr:eq("+i+") td:eq(1)").text();
						var td2=$("#details .products_susume table table tr:eq("+i+") td:eq(2)").text().replace(/\s/,"_");
						if(sc==td1&&pname==td2){
							alert("产品重复！");
							return;
						}
					}
					$("#waiting").show();
					pname=pname.replace(/\s/,"_");
					$.ajax({
						url:"manageBestProducts",
						type:"post",
						data:{"manage":"add","classone":fc,"classtwo":sc,"productname":pname},
						success:function(data){
							$("#waiting").hide();
							var s="<tr><td>"+fc+"</td><td>"+sc+"</td><td>"+pname+"</td><td><span class='button'>删除</span></td></tr>"
							$("#details .products_susume .add1").before(s);
							$("#details .products_susume .add2").hide();
							if($("#details .products_susume table table tr").length>=7){
								$("#details .products_susume .add1").hide();
							}
							else{
								$("#details .products_susume .add1").show();
							}
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_susume .add2").hide();
					$("#details .products_susume .add1").show();
				}
			});
			$("#full .products_susume .delete .button").click(function(){
				if($(this).text()=="确定"){
					var fc=$(this).siblings("p.fc").text();
					var sc=$(this).siblings("p.sc").text();
					var pname=$(this).siblings("p.pname").text();
					var n=$(this).siblings("p.number").text();
					$("#bottom").hide();
					$("#full .products_susume .delete").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageBestProducts",
						type:"post",
						data:{"manage":"delete","classone":fc,"classtwo":sc,"productname":pname},
						success:function(data){
							$("#details .products_susume .details tr:eq("+n+")").remove();
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
	//-----------------------news_edit-----------------------
		var newsData;
		var page=new Array();
		//新闻显示函数
			function NewsShow(data,sp){
				var mark=parseInt(sp)-1;
				page=new Array();
				if(data.news){
					var n=parseInt(data.newscount);
					if(n==0){
						var p=1;
					}
					else{
						var p=Math.ceil(n/10);
					}
					if(mark+1>p){
						c--;
						mark--;
					}
					for(var i=0;i<p;i++){
						var title=new Array();
						var date=new Array();
						if(n-i*10>=10){
							for(var j=0;j<10;j++){
								title[j]=data.news[i*10+j].replace(/\#.+/,"");
								date[j]=data.news[i*10+j].replace(/.+\#/,"");
							}
						}
						else{
							var last=n-i*10;
							for(var j=0;j<last;j++){
								title[j]=data.news[i*10+j].replace(/\#.+/,"");
								date[j]=data.news[i*10+j].replace(/.+\#/,"");
							}
						}
						page[i]={ntitle:title,date:date};
					}
				}
				if(data.newscount>10){
					showPage(data.newscount,"page");
					$("#page div:eq("+mark+")").click();
				}
				else{
					$("#page").html("");
					var s="<tr><td>标题</td><td>发布时间</td><td>操作</td></tr>";
					for(var i=0;i<page[0].ntitle.length;i++){
						s+="<tr><td>"+page[0].ntitle[i]+"</td><td>"+page[0].date[i]+"</td><td><span class='button'>删除</span><span class='button'>修改</span></td></tr>"
					}
					$("#details .news_edit table table").html(s);
				}
			}
		//点击进入页面时发送ajax
			$("#function .news_edit").click(function(){
				$("#details .news_edit .alter").hide();
				$("#details .news_edit .click_edit").hide();
				$("#details .edit_box").remove();
				$(this).find(".click_edit").show();
				$.ajax({
					url:"manageNews",
					type:"post",
					data:{manage:"get"},
					success:function(data){
						NewsShow(data,1);
						newsData=data;
						$("#details .news_edit .click_edit").show();
					},
					error:function(){}
				});
			});
		//点击页码换页
			$("#page").delegate("div","click",function(){
				var mark=c-1;
				var s="<tr><td>标题</td><td>发布时间</td><td>操作</td></tr>";
				for(var i=0;i<page[mark].ntitle.length;i++){
					s+="<tr><td>"+page[mark].ntitle[i]+"</td><td>"+page[mark].date[i]+"</td><td><span class='button'>删除</span><span class='button'>修改</span></td></tr>"
				}
				$("#details .news_edit table table").html(s);
			})
		//点击功能按钮
			c=0;
			$("#details .news_edit").delegate(".button","click",function(){
				if($(this).text()=="删除"){
					var number=$("#details .news_edit table table tr").index($(this).parent().parent());
					if(c){
						number+=(c-1)*10-1;
					}
					else{
						number-=1;
					}
					var title=$(this).closest("tr").find("td:eq(0)").text();
					var time=$(this).closest("tr").find("td:eq(1)").text();
					$("#full .news_edit .delete .news_title").text(title);
					$("#full .news_edit .delete .news_date").text(time);
					$("#full .news_edit .delete .number").text(number);
					$("#bottom").show();
					$("#full .news_edit .delete").show();
				}
				else if($(this).text()=="修改"){
					var number=$("#details .news_edit table table tr").index($(this).parent().parent());
					if(c){
						number+=(c-1)*10-1;
					}
					else{
						number-=1;
					}
					$("#full .news_edit .delete .number").text(number);
					var title=$(this).closest("tr").find("td:eq(0)").text();
					var time=$(this).closest("tr").find("td:eq(1)").text();
					$.ajax({
						url:"manageNews",
						type:"post",
						data:{manage:"edit",newstitle:title,time:time},
						success:function(data){
							id=data.id;
							$("#details .news_edit .alter").show();
							$("#details .news_edit .alter .button").click();
							$("#details .news_edit .alter #news_title").val(data.newstitle);
							if(data.content.length==0){
								$("#details .news_edit .alter #text_box").html("<p> </p><p><br></p>");
							}
							else{
								$("#details .news_edit .alter #text_box").html(data.content);
							}
							$("#details .news_edit .add .click_edit").show();
						},
						error:function(){}
					});
				}
			});
		//确定取消按钮
			$("#full .news_edit .delete .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full .news_edit .delete").hide();
					$("#waiting").show();
					var title=$("#full .news_edit .delete .news_title").text();
					var t=$("#full .news_edit .delete .news_date").text();
					var number=parseInt($("#full .news_edit .delete .number").text());
					$.ajax({
						url:"manageNews",
						type:"post",
						data:{manage:"delete",newstitle:title,time:t},
						success:function(data){
							newsData.newscount-=1;
							newsData.news.splice(number,1);
							if(c){
								NewsShow(newsData,c);
							}
							else{
								NewsShow(newsData,1);
							}
							$("#details .news_edit .alter").hide();
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
		//文章编辑框
			$("#details .news_edit").delegate(".click_edit","click",function(){
				$("#details .news_edit #news_title").show();
				if($(this).closest("tr").hasClass("add")){
					$("#details .news_edit .alter").hide();
				}
			});
			$("#details .news_edit").delegate("#file","change",function(){
				var file=document.getElementById("file");
				var picform=document.getElementById("picform");
				if(/image/.test(file.files[0].type)){
					if(file.files[0].name.length>=28){
						picform.reset();
						alert("文件名过长");
						return;
					}
					var formdata=new FormData();
					formdata.append("pic",file.files[0]);
					$.ajax({
						url:"saveNewsPic",
						type:"POST",
						contentType:false,
						processData:false,
						data:formdata,
						success:function(data){
							if(data.picname){
								var img=document.createElement("img");
								img.src=data.picname;
								range.insertNode(img);
								range.setStartAfter(img);
								img.onload=function(){
									var t=$('#text_box').get(0);
									var h=document.body.scrollTop;
									t.style.height=0+"px";
									if(t.scrollHeight>300){
										t.style.height=t.scrollHeight+50+"px";
										heightMark=t.scrollHeight;
									}
									else{
										t.style.height=t.scrollHeight+"px";
									}
								}
							}
							else{
								alert("图片返回失败");
							}
						},
						error:function(){
							alert("图片上传失败");
						}
					});
				}
				else{
					alert("请选择图片文件");
				}
        		picform.reset();
			});
			$("#details .news_edit").delegate(".pub","click",function(){
				if($(this).closest("tr").hasClass("alter")){
					var title=$("#details .news_edit .alter #news_title").val();
					if(title.replace(/\s/g,"").length<1){
						alert("标题为空");
						return;
					}
					var text=$("#details .news_edit .alter #text_box").html();
					text=text.replace(/&amp;/g,"&");
					var number=parseInt($("#full .news_edit .delete .number").text());
					$("#waiting").show();
					$.ajax({
						url:"manageNews",
						type:"post",
						data:{manage:"update",newstitle:title,content:text,id:id},
						success:function(data){
							$("#details .news_edit .alter").hide();
							$("#details .news_edit .add .click_edit").show();
							newsData.news[number]=newsData.news[number].replace(/.+\#/,title+"#");
							if(c){
								NewsShow(newsData,c);
							}
							else{
								NewsShow(newsData,1);
							}
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
				else if($(this).closest("tr").hasClass("add")){
					var title=$("#details .news_edit .add #news_title").val();
					if(title.replace(/\s/g,"").length<1){
						alert("标题为空");
						return;
					}
					//检测标题是否重复
					for(var i=0;i<newsData.news.length;i++){
						if(title==newsData.news[i].replace(/\#.+/,"")){
							alert("新闻标题重复！");
							return;
						}
					}
					var text=$("#details .news_edit .add #text_box").html();
					text=text.replace(/&amp;/g,"&");
					$("#waiting").show();
					$.ajax({
						url:"manageNews",
						type:"post",
						data:{manage:"add",newstitle:title,content:text},
						success:function(data){
							$("#details .news_edit .edit_box").remove();
							$("#details .news_edit .add .click_edit").show();
							NewsShow(data,1);
							newsData=data;
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
	//-----------------------recruitment_type-----------------------
		//点击进入页面时发送ajax
			$("#function .recruitment_type").click(function(){
				$("#details .recruitment_type .details").hide();
				$("#details .recruitment_type .edit").hide();
				$.ajax({
					url:"manageJob",
					type:"post",
					data:{manage:"class"},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.class.length;i++){
							option=document.createElement("option");
							option.text=data.class[i];
							s.appendChild(option);
						}
						$("#details .recruitment_type td.rclass").html(s);
						$("#details .recruitment_type .details").show();
					},
					error:function(){
						//alert("页面获取失败");
					}
				});
			});
		//点击选择分类时清空edit框
			$("#details .recruitment_type").delegate("select","change",function(){
				$("#details .recruitment_type .edit").hide();
			})
		//点击功能按钮
			$("#details .recruitment_type .button").click(function(){
				var sclass=$(this).closest("tr").find("option:selected").text();
				if($(this).text()=="添加"){
					$("#details .recruitment_type .edit").hide();
					$("#details .recruitment_type .add input").val("");
					$("#details .recruitment_type .add").show();
					$("#details .recruitment_type .add input").select();
				}
				else if(sclass!="请选择分类"){
					if($(this).text()=="删除"){
						$("#details .recruitment_type .edit").hide();
						$("#bottom").show();
						$("#full .recruitment_type .delete p span").text(sclass);
						$("#full .recruitment_type .delete").show();
					}
					else if($(this).text()=="修改"){
						$("#details .recruitment_type .edit").hide();
						$("#details .recruitment_type .alter input").val(sclass);
						$("#details .recruitment_type .alter").show();
						$("#details .recruitment_type .alter input").select();
					}
				}
			});
		//确定取消按钮
			$("#details .recruitment_type .button").click(function(){
				if($(this).text()=="取消"){
					$("#details .recruitment_type .edit").hide();				}
			});
			$("#details .recruitment_type .add .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					//检查分类是否重复！
					var select=$("#details .recruitment_type select");
					if(!cn){
						return;
					}
					for(var i=1;i<select.find("option").length;i++){
						if(select.find("option:eq("+i+")").text()==cn){
							alert("分类名重复！");
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageJob",
						type:"post",
						data:{"manage":"addclass","name":cn},
						success:function(data){
							$("#details .recruitment_type .edit").hide();
							$("#details .recruitment_type select").append("<option>"+cn+"</option>");
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#details .recruitment_type .alter .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("tr").find("input").val().replace(/\s/g,"");
					//检查分类是否重复！
					var select=$("#details .recruitment_type select");
					var ocn=select.find("option:selected").text();
					if(!cn){
						return;
					}
					for(var i=1;i<select.find("option").length;i++){
						if(select.find("option:eq("+i+")").text()==cn){
							$("#details .recruitment_type .edit").hide();
							return;
						}
					}
					$("#waiting").show();
					$.ajax({
						url:"manageJob",
						type:"post",
						data:{"manage":"editclass","oldname":ocn,"newname":cn},
						success:function(data){
							$("#details .recruitment_type .edit").hide();
							select.find("option:selected").text(cn);
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
				else if($(this).text()=="取消"){
					$("#details .products_type .edit").hide();
				}
			});
			$("#full .recruitment_type .delete .button").click(function(){
				if($(this).text()=="确定"){
					var cn=$(this).closest("div").find("span.class").text();
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageJob",
						type:"post",
						data:{"manage":"deleteclass","name":cn},
						success:function(data){
							$("#waiting").hide();
							$("#details .recruitment_type select option:selected").remove();
						},
						error:function(){}
					});
				}
			});
	//-----------------------recruitment_require-----------------------
		//点击进入页面时发送ajax
			$("#function .recruitment_require").click(function(){
				$("#details .recruitment_require .click_edit").hide();
				$("#details .recruitment_require .edit_box").hide();
				$("#details .recruitment_require .details").hide();
				$.ajax({
					url:"manageJob",
					type:"post",
					data:{manage:"class"},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择分类";
						s.appendChild(option);
						for(var i=0;i<data.class.length;i++){
							option=document.createElement("option");
							option.text=data.class[i];
							s.appendChild(option);
						}
						$("#details .recruitment_require td.rclass").html(s);
					},
					error:function(){
						//alert("页面获取失败");
					}
				});
			});
		//点击选项时发送ajax请求
			$("#details .recruitment_require").delegate("select","change",function(){
				$("#details .recruitment_require .click_edit").hide();
				$("#details .recruitment_require .edit_box").hide();
				$("#details .recruitment_require .details").hide();
				var s=$(this).find("option:selected").text();
				if(s=="请选择分类"){
					return;
				}
				$.ajax({
					url:"manageJob",
					type:"post",
					data:{manage:"get",name:s},
					success:function(data){
						var s=data.info;
						if(s.length==0){
							$("#details .recruitment_require .details div").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .recruitment_require .details div").html(s);
						}
						$("#details .recruitment_require .edit_box").remove();
						$("#details .recruitment_require .details").show();
						$("#details .recruitment_require .click_edit").show();
					},
					error:function(){}
				});
			});
		//文章编辑框
			$("#details .recruitment_require .click_edit").click(function(){
				$("#details .recruitment_require .edit_function span:eq(0)").hide();
				var s=$("#details .recruitment_require .details div").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#details .recruitment_require #text_box").html(s);
				}
			});
			$("#details .recruitment_require").delegate(".pub","click",function(){
				var name=$("#details .recruitment_require select option:selected").text();
				var text=$("#details .recruitment_require #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"manageJob",
					type:"post",
					data:{manage:"edit",name:name,content:text},
					success:function(data){
						$("#details .recruitment_require .edit_box").hide();
						$("#details .recruitment_require .details div").html(text);
						$("#details .recruitment_require .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------culture_summary-----------------------
		//点击进入页面时发送ajax
			$("#function .culture_summary").click(function(){
				var w=$("#details .culture_summary tr td:eq(0)").width();
				$("#details .culture_summary tr td:eq(0)").width(w);
				$("#details .culture_summary .click_edit").hide();
				$("#details .culture_summary .edit_box").hide();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"companyinfo",manage:"get"},
					success:function(data){
						var s=data.content;
						if(s.length==0){
							$("#details .culture_summary #intro").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .culture_summary #intro").html(s);
						}
						$("#details .culture_summary .click_edit").show();
					},
					error:function(){
					}
				});
			});
		//文章编辑框
			$("#details .culture_summary .click_edit").click(function(){
				$("#details .culture_summary .edit_function span:eq(0)").hide();
				var s=$("#details .culture_summary #intro").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#details .culture_summary #text_box").html(s);
				}
			});
			$("#details .culture_summary").delegate(".pub","click",function(){
				var text=$("#details .culture_summary #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"companyinfo",manage:"edit",content:text},
					success:function(data){
						$("#details .culture_summary .edit_box").hide();
						$("#details .culture_summary #intro").html(text);
						$("#details .culture_summary .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------culture_spirit-----------------------
		//点击进入页面时发送ajax
			$("#function .culture_spirit").click(function(){
				$("#details .culture_spirit .click_edit").hide();
				$("#details .culture_spirit .edit_box").hide();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"greemind",manage:"get"},
					success:function(data){
						var s=data.content;
						if(s.length==0){
							$("#details .culture_spirit #spirit").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .culture_spirit #spirit").html(s);
						}
						$("#details .culture_spirit .click_edit").show();
					},
					error:function(){}
				});
			});
		//文章编辑框
			$("#details .culture_spirit .click_edit").click(function(){
				$("#details .culture_spirit .edit_function span:eq(0)").hide();
				var s=$("#details .culture_spirit #spirit").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#details .culture_spirit #text_box").html(s);
				}
			});
			$("#details .culture_spirit").delegate(".pub","click",function(){
				var text=$("#details .culture_spirit #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"greemind",manage:"edit",content:text},
					success:function(data){
						$("#details .culture_spirit .edit_box").hide();
						$("#details .culture_spirit #spirit").html(text);
						$("#details .culture_spirit .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------culture_speech-----------------------
		//点击进入页面时发送ajax
			$("#function .culture_speech").click(function(){
				var w=$("#details .culture_speech tr td:eq(0)").width();
				$("#details .culture_speech tr td:eq(0)").width(w);
				$("#details .culture_speech .click_edit").hide();
				$("#details .culture_speech .edit_box").hide();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"leaderword",manage:"get"},
					success:function(data){
						var s=data.content;
						if(s.length==0){
							$("#details .culture_speech #speech").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .culture_speech #speech").html(s);
						}
						$("#details .culture_speech .click_edit").show();
					},
					error:function(){}
				});
			});
		//文章编辑框
			$("#details .culture_speech .click_edit").click(function(){
				$("#details .culture_speech .edit_function span:eq(0)").hide();
				var s=$("#details .culture_speech #speech").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#details .culture_speech #text_box").html(s);
				}
			});
			$("#details .culture_speech").delegate(".pub","click",function(){
				var text=$("#details .culture_speech #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"leaderword",manage:"edit",content:text},
					success:function(data){
						$("#details .culture_speech .edit_box").hide();
						$("#details .culture_speech #speech").html(text);
						$("#details .culture_speech .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------culture_honor-----------------------
		//点击进入页面时发送ajax
			$("#function .culture_honor").click(function(){
				$.ajax({
					url:"manageCompanyCulture",
					type:"post",
					data:{part:"companyhonor",manage:"get"},
					success:function(data){
						var pics=data.honorpic;
						var s="";
						for(var i=0;i<pics.length;i++){
							var div=document.createElement("div");
							var img=document.createElement("img");
							img.src=pics[i];
							var input=document.createElement("input");
							input.type="checkbox";
							div.appendChild(img);
							div.appendChild(input);
							s+=div.outerHTML+"\n";
						}
						$("#details .culture_honor #honor_pics").html(s);
					},
					error:function(){}
				});
			});
		//点击功能按钮
			$("#details .culture_honor .button").click(function(){
				if($(this).text()=="删除"){
					var pic_name=new Array();
					var list="";
					var len=$("#details .culture_honor #honor_pics").find("input:checked").length;
					if(len==0){
						return;
					}
					for(var i=0;i<len;i++){
						if(i!=0){
							list+=" ";
						}
						pic_name[i]=$("#details .culture_honor #honor_pics").find("input:checked:eq("+i+")").prev().attr('src').replace(/.+\//,"");
						list+=pic_name[i];
					}
					$("#full .culture_honor .delete p span").text("选中的");
					$("#bottom").show();
					$("#full .culture_honor .delete").show();
				}
			});
		//确定取消按钮
			$("#details .culture_honor .add .button").click(function(){
				if($(this).text()=="确定"){
					if($("#details .culture_honor #honor_pics img").length>7){
						alert("最多8张图片");
						return;
					}
					var file=this.previousSibling;
					if(/image/.test(file.files[0].type)){
						if(file.files[0].name.length>=28){
							alert("文件名过长");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						if(file.files[0].size/1024>1024){
							alert("图片太大，请限制在1M以内");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=file.files[0].name.replace(/.+\./,"");
						if(s.toLowerCase()!=s){
							alert("请把图片后缀名改为小写");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var formdata=new FormData();
						formdata.append("part","companyhonor");
						formdata.append("manage","add");
						formdata.append("pic",file.files[0]);
						var t=this;
						$("#waiting").show();
						$.ajax({
							url:"manageCompanyCulture",
							type:"post",
							contentType:false,
							processData:false,
							data:formdata,
							success:function(data){
								var div=document.createElement("div");
								var img=document.createElement("img");
								img.src=data.picname;
								var input=document.createElement("input");
								input.type="checkbox";
								div.appendChild(img);
								div.appendChild(input);
								$("#details .culture_honor #honor_pics").append(div).append("\n");
								$(t).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else{
						alert("请选择图片文件");
					}
				}
				else if($(this).text()=="取消"){
					$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
				}
			});
			$("#full .culture_honor .delete .button").click(function(){
				if($(this).text()=="确定"){
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					var ppname=new Array();
					for(var i=0;i<$("#details .culture_honor #honor_pics").find("input:checked").length;i++){
						ppname[i]=$("#details .culture_honor #honor_pics").find("input:checked:eq("+i+")").prev().attr('src').replace(/.+\//,"");
					}
					//var ppname=$(this).siblings("p").find(".pic_name").text();
					//ppname=ppname.replace(/\s/g,"\",\"");
					//ppname="[\""+ppname+"\"]";
					$.ajax({
						url:"manageCompanyCulture",
						type:"post",
						data:{part:"companyhonor",manage:"delete",pic:ppname},
						success:function(data){
							var len=$("#details .culture_honor #honor_pics").find("input:checked").length;
							for(var i=0;i<len;i++){
								$("#details .culture_honor #honor_pics").find("input:checked:eq(0)").parent().remove();
							}
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
	//-----------------------contact_details-----------------------
		//点击进入页面时发送ajax
			$("#function .contact_details").click(function(){
				$("#details .contact_details .click_edit").hide();
				$("#details .contact_details .edit_box").hide();
				$.ajax({
					url:"manageContactUs",
					type:"post",
					data:{manage:"get"},
					success:function(data){
						var s=data.content;
						if(s.length==0){
							$("#contact_way").html("<p> </p><p><br></p>");
						}
						else{
							$("#contact_way").html(s);
						}
						$("#details .contact_details .click_edit").show();
					},
					error:function(){}
				});
			});
		//文章编辑框
			$("#details .contact_details .click_edit").click(function(){
				$("#details .contact_details .edit_function span:eq(0)").hide();
				var s=$("#details .contact_details #contact_way").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#details .contact_details #text_box").html(s);
				}
			});
			$("#details .contact_details").delegate(".pub","click",function(){
				var text=$("#details .contact_details #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"manageContactUs",
					type:"post",
					data:{manage:"edit",content:text},
					success:function(data){
						$("#details .contact_details .edit_box").hide();
						$("#details .contact_details #contact_way").html(text);
						$("#details .contact_details .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
	//-----------------------stores_show-----------------------
		//点击进入页面时发送ajax
			$("#function .stores_show").click(function(){
				$("#details .stores_show .details").hide();
				$("#details .stores_show .details1").hide();
				$("#details .stores_show .edit").hide();
				$("#details .stores_show .click_edit").show();
				$("#details .edit_box").remove();
				$.ajax({
					url:"manageShop",
					type:"post",
					data:{manage:"get"},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择店铺";
						s.appendChild(option);
						for(var i=0;i<data.shop.length;i++){
							option=document.createElement("option");
							option.text=data.shop[i];
							s.appendChild(option);
						}
						$("#details .stores_show select").html(s.innerHTML);
						$("#details .stores_show .details1").show();
					},
					error:function(){
						//alert("页面获取失败");
					}
				});
			});
		//点击选项发送ajax请求
			$("#details .stores_show select").change(function(){
				$("#details .stores_show .details").hide();
				$("#details .stores_show .click_edit").show();
				$("#details .edit_box").remove();
				$("#details .stores_show .edit").hide();
				var s=$("#details .stores_show select option:selected").text();
				if(s=="请选择店铺"){
					return;
				}
				$("#waiting").show();
				$.ajax({
					url:"manageShop",
					type:"post",
					data:{manage:"get",shopname:s},
					success:function(data){
						$("#details .stores_show .c_pic img").attr({"src":data.pic});
						if(data.content.length==0){
							$("#details .stores_show .c_detail div").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .stores_show .c_detail div").html(data.content);
						}
						$("#details .stores_show input[type='file']").prop("outerHTML","<input type='file' accept='image/*'>");
						$("#details .stores_show .details").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
		//点击功能按钮
			$("#details .stores_show .name_edit .button").click(function(){
				var sclass=$("#details .stores_show select option:selected").text();
				$("#details .stores_show .edit").hide();
				if($(this).text()=="添加"){
					$("#details .stores_show .add input").val("");
					$("#details .stores_show .add").show();
					$("#details .stores_show .add input").select();
				}
				else if($(this).text()=="排序"){
					if($(this).closest("tr").find("option").length<3){
						return;
					}
					$("#bottom").show();
					var list="";
					for(var i=1;i<$(this).closest("tr").find("option").length;i++){
						var o=$(this).closest("tr").find("option:eq("+i+")").text();
						list+="<p><input type='radio' name='engineering'><span>"+o+"</span></p>";
					}
					$("#full .stores_show .sort div").html(list);
					$("#full .stores_show .sort").show();
				}
				else if(sclass!="请选择店铺"){
					if($(this).text()=="删除"){
						$("#bottom").show();
						var name=$(this).closest("tr").find("option:selected").text();
						$("#full .stores_show .delete p span").text(name);
						$("#full .stores_show .delete").show();
					}
					else if($(this).text()=="编辑"){
						$("#details .stores_show .edit").hide();
						$("#details .stores_show .alter input").val(sclass);
						$("#details .stores_show .alter").show();
						$("#details .stores_show .alter input").select();
					}
				}
			});
		//文章编辑框
			$("#details .stores_show").on("click",".click_edit",function(){
				var s=$("#details .stores_show .c_detail div").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#text_box").html(s);
				}
			});
			$("#details .stores_show").delegate("#file","change",function(){
				var file=document.getElementById("file");
				var picform=document.getElementById("picform");
				if(/image/.test(file.files[0].type)){
					if(file.files[0].name.length>=28){
						picform.reset();
						alert("文件名过长");
						return;
					}
					if(file.files[0].size/1024>1024){
						picform.reset();
						alert("图片太大，请限制在1M以内");
						return;
					}
					var s=file.files[0].name.replace(/.+\./,"");
					if(s.toLowerCase()!=s){
						picform.reset();
						alert("请把图片后缀名改为小写");
						return;
					}
					var cname=$("#details .stores_show select option:selected").text();
					var formdata=new FormData();
					formdata.append("pic",file.files[0]);
					formdata.append("shopname",cname);
					$.ajax({
						url:"saveShopPic",
						type:"POST",
						contentType:false,
						processData:false,
						data:formdata,
						success:function(data){
							if(data.picname){
								var img=document.createElement("img");
								img.src=data.picname;
								range.insertNode(img);
								range.setStartAfter(img);
								img.onload=function(){
									var t=$('#text_box').get(0);
									var h=document.body.scrollTop;
									t.style.height=0+"px";
									if(t.scrollHeight>300){
										t.style.height=t.scrollHeight+50+"px";
										heightMark=t.scrollHeight;
									}
									else{
										t.style.height=t.scrollHeight+"px";
									}
								}
							}
							else{
								alert("图片返回失败");
							}
						},
						error:function(){
							alert("图片上传失败");
						}
					});
				}
				else{
					alert("请选择图片文件");
				}
        		picform.reset();
			});
			$("#details .stores_show").delegate(".pub","click",function(){
				var cname=$("#details .stores_show select option:selected").text();
				var text=$("#details .stores_show #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"saveShopInfo",
					type:"post",
					data:{shopname:cname,content:text},
					success:function(data){
						$("#details .stores_show .c_detail div").html(text);
						$("#details .stores_show .edit_box").remove();
						$("#details .stores_show .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
		//确定取消按钮
			$("#details .stores_show .edit").delegate(".button","click",function(){
				if($(this).text()=="取消"){
					$("#details .stores_show .edit").hide();
				}
				else if($(this).text()=="确定"){
					var s=$(this).prev().val();
					if(!s){
						return;
					}
					if($(this).closest("tr").hasClass("add")){
						for(var i=1;i<$("#details .stores_show select option").length;i++){
							if(s==$("#details .stores_show select option:eq("+i+")").text()){
								alert("店铺名字重复！");
								return;
							}
						}
						$("#waiting").show();
						$.ajax({
							url:"manageShop",
							type:"post",
							data:{manage:"add",shopname:s},
							success:function(data){
								$("#details .stores_show select").append("<option>"+s+"</option>");
								$("#details .stores_show .edit").hide();
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else if($(this).closest("tr").hasClass("alter")){
						for(var i=1;i<$("#details .stores_show select option").length;i++){
							if(s==$("#details .stores_show select option:eq("+i+")").text()){
								alert("店铺名字重复！");
								return;
							}
						}
						var os=$("#details .stores_show select option:selected").text();
						$("#waiting").show();
						$.ajax({
							url:"manageShop",
							type:"post",
							data:{manage:"edit",shopname:s,oldname:os},
							success:function(data){
								$("#details .stores_show .edit").hide();
								for(var i=1;i<$("#details .stores_show select option").length;i++){
									if(os==$("#details .stores_show select option:eq("+i+")").text()){
										$("#details .stores_show select option:eq("+i+")").text(s);
									}
								}
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
				}
			});
			$("#full .stores_show .delete .button").click(function(){
				if($(this).text()=="确定"){
					var s=$(this).closest("div").find("p span").text();
					$("#bottom").hide();
					$("#full .stores_show .delete").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageShop",
						type:"post",
						data:{manage:"delete",shopname:s},
						success:function(data){
							for(var i=1;i<$("#details .stores_show select option").length;i++){
								if(s==$("#details .stores_show select option:eq("+i+")").text()){
									$("#details .stores_show select option:eq("+i+")").remove();
								}
							}
							$("#details .stores_show .details").hide();
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#full .stores_show .sort .button").click(function(){
				if($(this).text()=="确定"){
					var list="";
					var s=document.createElement("select");
					var option=document.createElement("option");
					option.text="请选择店铺";
					s.appendChild(option);
					for(var i=0;i<$(this).closest("div").find("div span").length;i++){
						if(i!=0){
							list+="#";
						}
						var option=document.createElement("option");
						option.text=$(this).closest("div").find("div span:eq("+i+")").text();
						list+=option.text;
						s.appendChild(option);
					}
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageShop",
						type:"post",
						data:{manage:"sort",sequence:list},
						success:function(data){
							$("#waiting").hide();
							$("#details .stores_show select").html(s.innerHTML);
							$("#details .stores_show .details").hide();
						},
						error:function(){}
					});
				}
			});
			$("#details .stores_show .edit_pic .button").click(function(){
				if($(this).text()=="确定"){
					var file=this.previousSibling;
					if(/image/.test(file.files[0].type)){
						if(file.files[0].name.length>=28){
							alert("文件名过长");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						if(file.files[0].size/1024>1024){
							alert("图片太大，请限制在1M以内");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=file.files[0].name.replace(/.+\./,"");
						if(s.toLowerCase()!=s){
							alert("请把图片后缀名改为小写");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=$("#details .stores_show select option:selected").text();
						var formdata=new FormData();
						formdata.append("pic",file.files[0]);
						formdata.append("shopname",s);
						var t=this;
						$("#waiting").show();
						$.ajax({
							url:"saveShopFirstPic",
							type:"post",
							contentType:false,
							processData:false,
							data:formdata,
							success:function(data){
								$("#details .stores_show .c_pic img").attr({"src":data.picname});
								$(t).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else{
						alert("请选择图片文件");
					}
				}
				else if($(this).text()=="取消"){
					$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
				}
			});
		//排序上下按钮
			$("#full .stores_show .up").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.prev().is("p")){
					checked.prev().before(s);
					var newChecked=checked.prev().prev();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .stores_show .down").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.next().is("p")){
					checked.next().after(s);
					var newChecked=checked.next().next();
					newChecked.find("input").click();
					checked.remove();
				}
			});
	//-----------------------engineering_show-----------------------
		//点击进入页面时发送ajax
			$("#function .engineering_show").click(function(){
				$("#details .engineering_show .details").hide();
				$("#details .engineering_show .details1").hide();
				$("#details .engineering_show .edit").hide();
				$("#details .engineering_show .click_edit").show();
				$("#details .edit_box").remove();
				$.ajax({
					url:"manageCase",
					type:"post",
					data:{manage:"get"},
					success:function(data){
						var s=document.createElement("select");
						var option=document.createElement("option");
						option.text="请选择工程";
						s.appendChild(option);
						for(var i=0;i<data.case.length;i++){
							option=document.createElement("option");
							option.text=data.case[i];
							s.appendChild(option);
						}
						$("#details .engineering_show select").html(s.innerHTML);
						$("#details .engineering_show .details1").show();
					},
					error:function(){
						//alert("页面获取失败");
					}
				});
			});
		//点击选项发送ajax请求
			$("#details .engineering_show select").change(function(){
				$("#details .engineering_show .details").hide();
				$("#details .engineering_show .click_edit").show();
				$("#details .edit_box").remove();
				$("#details .engineering_show .edit").hide();
				var s=$("#details .engineering_show select option:selected").text();
				if(s=="请选择工程"){
					$("#details .engineering_show .details").hide();
					return;
				}
				$("#waiting").show();
				$.ajax({
					url:"manageCase",
					type:"post",
					data:{manage:"get",casename:s},
					success:function(data){
						$("#details .engineering_show .c_pic img").attr({"src":data.pic});
						if(data.content.length==0){
							$("#details .engineering_show .c_detail div").html("<p> </p><p><br></p>");
						}
						else{
							$("#details .engineering_show .c_detail div").html(data.content);
						}
						$("#details .engineering_show input[type='file']").prop("outerHTML","<input type='file' accept='image/*'>");
						$("#details .engineering_show .details").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
		//点击功能按钮
			$("#details .engineering_show .name_edit .button").click(function(){
				var sclass=$("#details .engineering_show select option:selected").text();
				$("#details .engineering_show .edit").hide();
				if($(this).text()=="添加"){
					$("#details .engineering_show .add input").val("");
					$("#details .engineering_show .add").show();
					$("#details .engineering_show .add input").select();
				}
				else if($(this).text()=="排序"){
					if($(this).closest("tr").find("option").length<3){
						return;
					}
					$("#bottom").show();
					var list="";
					for(var i=1;i<$(this).closest("tr").find("option").length;i++){
						var o=$(this).closest("tr").find("option:eq("+i+")").text();
						list+="<p><input type='radio' name='engineering'><span>"+o+"</span></p>";
					}
					$("#full .engineering_show .sort div").html(list);
					$("#full .engineering_show .sort").show();
				}
				else if(sclass!="请选择工程"){
					if($(this).text()=="删除"){
						$("#bottom").show();
						var name=$(this).closest("tr").find("option:selected").text();
						$("#full .engineering_show .delete p span").text(name);
						$("#full .engineering_show .delete").show();
					}
					else if($(this).text()=="编辑"){
						$("#details .engineering_show .edit").hide();
						$("#details .engineering_show .alter input").val(sclass);
						$("#details .engineering_show .alter").show();
						$("#details .engineering_show .alter input").select();
					}
				}
			});
		//文章编辑框
			$("#details .engineering_show").on("click",".click_edit",function(){
				var s=$("#details .engineering_show .c_detail div").html();
				if(s.replace(/\s/g,"").length!=0){
					$("#text_box").html(s);
				}
			});
			$("#details .engineering_show").delegate("#file","change",function(){
				var file=document.getElementById("file");
				var picform=document.getElementById("picform");
				if(/image/.test(file.files[0].type)){
					if(file.files[0].name.length>=28){
						picform.reset();
						alert("文件名过长");
						return;
					}
					if(file.files[0].size/1024>1024){
						picform.reset();
						alert("图片太大，请限制在1M以内");
						return;
					}
					var s=file.files[0].name.replace(/.+\./,"");
					if(s.toLowerCase()!=s){
						picform.reset();
						alert("请把图片后缀名改为小写");
						return;
					}
					var cname=$("#details .engineering_show select option:selected").text();
					var formdata=new FormData();
					formdata.append("pic",file.files[0]);
					formdata.append("casename",cname);
					$.ajax({
						url:"saveCasePic",
						type:"POST",
						contentType:false,
						processData:false,
						data:formdata,
						success:function(data){
							if(data.picname){
								var img=document.createElement("img");
								img.src=data.picname;
								range.insertNode(img);
								range.setStartAfter(img);
								img.onload=function(){
									var t=$('#text_box').get(0);
									var h=document.body.scrollTop;
									t.style.height=0+"px";
									if(t.scrollHeight>300){
										t.style.height=t.scrollHeight+50+"px";
										heightMark=t.scrollHeight;
									}
									else{
										t.style.height=t.scrollHeight+"px";
									}
								}
							}
							else{
								alert("图片返回失败");
							}
						},
						error:function(){
							alert("图片上传失败");
						}
					});
				}
				else{
					alert("请选择图片文件");
				}
        		picform.reset();
			});
			$("#details .engineering_show").delegate(".pub","click",function(){
				var cname=$("#details .engineering_show select option:selected").text();
				var text=$("#details .engineering_show #text_box").html();
				text=text.replace(/&amp;/g,"&");
				$("#waiting").show();
				$.ajax({
					url:"saveCaseInfo",
					type:"post",
					data:{casename:cname,content:text},
					success:function(data){
						$("#details .engineering_show .c_detail div").html(text);
						$("#details .engineering_show .edit_box").remove();
						$("#details .engineering_show .click_edit").show();
						$("#waiting").hide();
					},
					error:function(){}
				});
			});
		//确定取消按钮
			$("#details .engineering_show .edit").delegate(".button","click",function(){
				if($(this).text()=="取消"){
					$("#details .engineering_show .edit").hide();
				}
				else if($(this).text()=="确定"){
					var s=$(this).prev().val();
					if(!s){
						return;
					}
					if($(this).closest("tr").hasClass("add")){
						for(var i=1;i<$("#details .engineering_show select option").length;i++){
							if(s==$("#details .engineering_show select option:eq("+i+")").text()){
								alert("工程名字重复！");
								return;
							}
						}
						$("#waiting").show();
						$.ajax({
							url:"manageCase",
							type:"post",
							data:{manage:"add",casename:s},
							success:function(data){
								$("#details .engineering_show select").append("<option>"+s+"</option>");
								$("#details .engineering_show .edit").hide();
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else if($(this).closest("tr").hasClass("alter")){
						for(var i=1;i<$("#details .engineering_show select option").length;i++){
							if(s==$("#details .engineering_show select option:eq("+i+")").text()){
								alert("工程名字重复！");
								return;
							}
						}
						var os=$("#details .engineering_show select option:selected").text();
						$("#waiting").show();
						$.ajax({
							url:"manageCase",
							type:"post",
							data:{manage:"edit",casename:s,oldname:os},
							success:function(data){
								$("#details .engineering_show .edit").hide();
								for(var i=1;i<$("#details .engineering_show select option").length;i++){
									if(os==$("#details .engineering_show select option:eq("+i+")").text()){
										$("#details .engineering_show select option:eq("+i+")").text(s);
									}
								}
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
				}
			});
			$("#full .engineering_show .delete .button").click(function(){
				if($(this).text()=="确定"){
					var s=$(this).closest("div").find("p span").text();
					$("#bottom").hide();
					$("#full .engineering_show .delete").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageCase",
						type:"post",
						data:{manage:"delete",casename:s},
						success:function(data){
							for(var i=1;i<$("#details .engineering_show select option").length;i++){
								if(s==$("#details .engineering_show select option:eq("+i+")").text()){
									$("#details .engineering_show select option:eq("+i+")").remove();
								}
							}
							$("#details .engineering_show .details").hide();
							$("#waiting").hide();
						},
						error:function(){}
					});
				}
			});
			$("#full .engineering_show .sort .button").click(function(){
				if($(this).text()=="确定"){
					var list="";
					var s=document.createElement("select");
					var option=document.createElement("option");
					option.text="请选择工程";
					s.appendChild(option);
					for(var i=0;i<$(this).closest("div").find("div span").length;i++){
						if(i!=0){
							list+="#";
						}
						var option=document.createElement("option");
						option.text=$(this).closest("div").find("div span:eq("+i+")").text();
						list+=option.text;
						s.appendChild(option);
					}
					$("#bottom").hide();
					$("#full>div>div").hide();
					$("#waiting").show();
					$.ajax({
						url:"manageCase",
						type:"post",
						data:{manage:"sort",sequence:list},
						success:function(data){
							$("#waiting").hide();
							$("#details .engineering_show select").html(s.innerHTML);
							$("#details .engineering_show .details").hide();
						},
						error:function(){}
					});
				}
			});
			$("#details .engineering_show .edit_pic .button").click(function(){
				if($(this).text()=="确定"){
					var file=this.previousSibling;
					if(/image/.test(file.files[0].type)){
						if(file.files[0].name.length>=28){
							alert("文件名过长");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						if(file.files[0].size/1024>1024){
							alert("图片太大，请限制在1M以内");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=file.files[0].name.replace(/.+\./,"");
						if(s.toLowerCase()!=s){
							alert("请把图片后缀名改为小写");
							$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
							return;
						}
						var s=$("#details .engineering_show select option:selected").text();
						var formdata=new FormData();
						formdata.append("pic",file.files[0]);
						formdata.append("casename",s);
						var t=this;
						$("#waiting").show();
						var data={picname:"picname.jpg"};
						$.ajax({
							url:"saveCaseFirstPic",
							type:"post",
							contentType:false,
							processData:false,
							data:formdata,
							success:function(data){
								$("#details .engineering_show .c_pic img").attr({"src":data.picname});
								$(t).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
								$("#waiting").hide();
							},
							error:function(){}
						});
					}
					else{
						alert("请选择图片文件");
					}
				}
				else if($(this).text()=="取消"){
					$(this).siblings("input").prop("outerHTML","<input type='file' accept='image/*'>");
				}
			});
		//排序上下按钮
			$("#full .engineering_show .up").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.prev().is("p")){
					checked.prev().before(s);
					var newChecked=checked.prev().prev();
					newChecked.find("input").click();
					checked.remove();
				}
			});
			$("#full .engineering_show .down").click(function(){
				var checked=$(this).closest("div").find("input:checked").parent();
				var s=checked.prop("outerHTML");
				if(checked.next().is("p")){
					checked.next().after(s);
					var newChecked=checked.next().next();
					newChecked.find("input").click();
					checked.remove();
				}
			});
	//-----------------------弹出框上下居中-------------------------
		$("#details .button").click(function(){
			if($(this).text()=="删除"||$(this).text()=="排序"){
				var count=0;
				for(var i=0;i<$("#full .box").length;i++){
					var s=$("#full .box:eq("+i+")").height();
					s=parseInt(s);
					count+=s;
				}
				$("#full .box").css({"margin-top":(-count/2)+"px"});
			}
		});
}