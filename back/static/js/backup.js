window.onload=function(){
		$("#right").css("width",(window.innerWidth-140)+"px");
   		window.onresize=function(){
    		$("#right").css("width",(window.innerWidth-140)+"px");
    	}

    	//选项选择和点击时的效果
    	$("#list li").mouseover(function(){
    		$(this).css("background-color","rgba(65,65,65,0.2)");
    	});
    	$("#list li").mouseout(function(){
    		$(this).css("background-color","transparent");
    	});
    	$("#list li").click(function(){
    		$("#list li").css({"background-color":"transparent","color":"#f1f1f1"});
    		$(this).css({"background-color":"white","color":"#34333f"});
    		$("#list li").unbind("mouseover");
    		$("#list li").mouseover(function(){
    			$(this).css("background-color","rgba(65,65,65,0.2)");
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
    		$(this).css({"background-color":"white"});
    		$("#function li").unbind("mouseover");
    		$("#function li").mouseover(function(){
    			$(this).css("background-color","rgba(65,65,65,0.1)");
    		});
    		$(this).unbind("mouseover");
    		$("#function li").unbind("mouseout");
    		$("#function li").mouseout(function(){
    			$(this).css("background-color","transparent");
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
    		$("#function ul").hide();
    		if(liRecord){
    			$("#details ."+liRecord).hide();
    		}
    		liRecord=this.className;
    		$("#details ."+liRecord).show();
    	});

		/*表格格式
		var trCount=0;
		var s="div.products_details table table";
		$(".table_title td").css("background-color","#226ddd");
		for(var i=0;i<$(s+" tr").length;i++){
			if($(s+" tr:eq("+i+")").hasClass("table_title")){
				trCount=0;
			}
			else{
				trCount++;
			}
			if(trCount&&trCount%2==0){
				$(s+" tr:eq("+i+")").css("background-color","#f1f1f1");
			}
		}
		*/
		//页码生成函数
		function showPage(n,id,pn){
			//根据显示项数目生成Ajax式页码栏
			if(n<=24){
				$("#"+id).html("No More");
				return;
			}
			var max=10;
			var half=Math.floor((max-1)/2);
			var pages=Math.ceil(n/8);
			var gridrecord=0;
			var grid,pagerecord=1;
			if(pages<=max){
				for(var i=1;i<=pages;i++){
					$("#"+id).append("<div>"+i+"</div>");
				}
				$("#"+id).append("<div>></div>");
				grid=pages;
				$("#"+id+" div").click(function(){
					if(pn){
						var c=parseInt(pn);
					}
					else{
						var c=parseInt($(this).text());
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
					$("#"+id).append("<div>"+i+"</div>");
				}
				$("#"+id).append("<div>...</div><div>"+pages+"</div>")
				$("#"+id).append("<div>></div>");
				grid=max+1;
				$("#"+id+" div").click(function(){
					if(pn){
						var c=parseInt(pn);
					}
					else{
						var c=parseInt($(this).text());
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
		showPage(100,"page");

		//编写框
		$(".click_edit").click(function(){
			$(this).parent().append("<div class='edit_box'><div class='edit_function'><span>插入图片</span><span>发布新闻</span></div><div class='text_box' contenteditable></div></div>");
			$(this).hide();
		});
}