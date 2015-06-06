window.onload=function(){
		if(window.localStorage.newstitle){
			var sto=window.localStorage;
			var indextitle=sto.newstitle;
			sto.removeItem("newstitle");
		}
		//首页跳转显示新闻
			if(indextitle){
				$("#news_list").hide();
				$.ajax({
					url:"getNews",
					type:"post",
					data:{title:indextitle},
					success:function(data){
						$("#news_title").text(indextitle);
						$("#news_date").text("发布时间：");
						$("#text").html(data.content);
						$("#news_list").hide();
						$("#page").hide();
						$("#main").show();
						$("#news_nav").append("<span class='not_link'> > </span><span class='link'>"+indextitle+"</span>")
						window.scrollTo(0,0);
					},
					error:function(){}
				});
			}
		function showPage(n,id,pn){
			//根据显示项数目生成Ajax式页码栏
			if(n<=10){
				$("#"+id).html("No More");
				return;
			}
			var max=10;
			var half=Math.floor((max-1)/2);
			var pages=Math.ceil(n/10);
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
					$("#"+id).append("<div>"+i+"</div>");
				}
				$("#"+id).append("<div>...</div><div>"+pages+"</div>")
				$("#"+id).append("<div>></div>");
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
		var n=$("#page").attr("data-n");
		n=parseInt(n);
		showPage(n,"page");
		$("#page div:eq(0)").click();
		$("#page").delegate("div","click",function(){
			if(c.toString()=="NaN"){
				return;
			}
			$.ajax({
				url:"moreNews",
				type:"post",
				data:{page:c},
				success:function(data){
					$("#news_list").html(data.html);
				},
				error:function(){
					alert("页码出错");
				}
			});
		});
		//点击查看新闻
			$(".news_box").click(function(){
				var title=$(this).find(".news_title").text();
				var date=$(this).find(".ym").text()+" "+$(this).find(".day").text();
				$.ajax({
					url:"getNews",
					type:"post",
					data:{title:title},
					success:function(data){
						$("#news_title").text(title);
						$("#news_date").text("发布时间："+date);
						$("#text").html(data.content);
						$("#news_list").hide();
						$("#page").hide();
						$("#main").show();
						$("#news_nav").append("<span class='not_link'> > </span><span class='link'>"+title+"</span>")
						window.scrollTo(0,0);
					},
					error:function(){}
				});
			});
		//点击返回新闻列表
			$("#back").click(function(){
				$("#news_nav span:last").remove();
				$("#news_nav span:last").remove();
				$("#news_list").show();
				$("#page").show();
				$("#main").hide();
				window.scrollTo(0,0);
			});
}