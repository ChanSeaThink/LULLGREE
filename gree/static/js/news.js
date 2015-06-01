window.onload=function(){
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
				var data={content:"<p>应巴西联邦共和国总统罗塞夫邀请，中国国务院总理李克强于当地时间5月18日至21日对巴西进行了为期四天的访问。同为发展中大国和金砖四国成员，中巴两国在产能和装备制造等领域再次展开了广泛深入的交流与合作。</p><p>此次随总理一道出访巴西的还有数十家中国企业，涉及金融、能源、基建、互联网和装备制造领域。这些企业在随访期间参加了中巴工商峰会和中国装备制造业展览。作为随访企业中唯一的家电企业，格力电器在众多名企中格外引人注目。</p><p>此次随访巴西的格力电器由其董事长董明珠带队，在19日的中巴工商峰会上，董明珠作为中国企业代表发言，她指出，中巴两国在空调领域的产能合作前景非常广阔。同时希望巴西政府能为在巴西投资的企业提供更好的投资环境，通过不断地增进了解，克服文化、地域和政策差异造成的障碍，促进两国产能合作迈上新台阶。</p><p>20日开幕的中国装备制造业展览是此次随行企业的重头戏，李克强总理出席了开幕式并对展览进行了巡视。在格力展位上，董明珠向总理介绍了格力的新产品、新技术。</p><p>据了解，格力展台共分为6大版块，分区域展示了格力电器的全球形象，格力巴西基地的发展历程，众多国际领先的技术和产品，其中光伏中央空调、全能王空调等尖端产品吸引了众多参观者的目光，获得一致好评。</p><p>格力电器此次在巴西备受关注，实际上是与格力十多年来深耕巴西市场密不可分的。上世纪90年代中期，格力开始进入巴西市场，并在1998年成立巴西格力销售公司，大力推广格力自主品牌产品。在获得稳定的市场增长之后，格力于2001年斥资2000多万美金在亚马逊州首府玛瑙斯建立空调生产基地。这是国内空调企业在海外设立的第一个生产基地，格力也因此成为中国第一家“走出去”的家电企业。</p><p>15年的精耕细作，格力凭借其全球领先的技术、过硬的产品质量赢得了巴西消费者的认可和信赖，品牌的提升也促进了格力空调在巴西市场的大幅增长。据统计，格力在巴西累计销售自主品牌超过51亿，目前其是当地销售价格最高的空调产品之一。在2014年的巴西足球世界杯上，格力一举拿下阿雷格里港贝拉利奥球场工程项目、巴西利亚机场、巴西全国性电视台ReadTV的扩建项目等多个空调工程，更是使得格力成为在巴西家喻户晓的空调品牌。</p><p>随着中巴两国在产能领域的合作逐渐深入，格力在巴西乃至整个南美洲的市场份额将进一步扩大，市场竞争力也将进一步增强。</p>"}
						$("#news_title").text(title);
						$("#news_date").text("发布时间："+date);
						$("#text").html(data.content);
						$("#news_list").hide();
						$("#page").hide();
						$("#main").show();
						$("#news_nav").append("<span class='not_link'> > </span><span class='link'>"+title+"</span>")
						window.scrollTo(0,0);
				$.ajax({
					url:"getNews",
					type:"post",
					data:{title:s},
					success:function(data){
						$("#news_title").text(title);
						$("#news_date").text("发布时间："+date);
						$("#text").html(data.content);
						$("news_list").hide();
						$("#page").hide();
						$("#main").show();
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