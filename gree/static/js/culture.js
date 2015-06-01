window.onload=function(){
	var w=parseInt($("#pic_box img:first").css("width"))+9;
	if(window.navigator.userAgent.indexOf("Firefox")<0){
		for(var i=0;i<$("#pic_box img").length;i++){
			var image=$("#pic_box img:eq("+i+")");
			if(i==0){
				image.css("z-index",-7);
				image.css("-webkit-transform","rotateY(60deg)");
				image.css("transform","rotateY(60deg)");
			}
			if(i>=4){
				image.css("z-index",-i);
				image.css("left",-w-w*(i-4)/2);
				image.css("-webkit-transform","rotateY(-60deg)");
				image.css("transform","rotateY(-60deg)");
			}
			else{
				image.css("left",-w);
			}
		}
	}
	var picbox=document.getElementById("pic_box");
	var n=0,count1=1,count2=3;
	picbox.onmousewheel=picSlide;
	function picSlide(e){
		e=e||window.event;
		e.preventDefault();
		if(e.wheelDelta){
			if(e.wheelDelta>0)n=1;
			else n=-1;
			$("img",this).stop(true,true);
			var left1=$("img:first",this).offset().left-$(this).offset().left;
			var left2=$("img:last",this).offset().left-$(this).offset().left;
			var left=123;
			if((left1>w/2&&n>0)||(left2<3*w&&n<0))
				return;
			var pb=this;
			pb.onmousewheel=function(e){e.preventDefault()};
			setTimeout(function(){
				pb.onmousewheel=picSlide;
			},500);
			var len=$("img",this).length;
			var t=0,img,l,sflag=0;
			for(var i=0;i<len;i++){
				img=$("img:eq("+i+")",this);
				l=img.offset().left-$(this).offset().left;
				t=l+w*n;
				if(n<0){
					if(i<count1||i>count2+1){
						img.animate({left:"+="+w*n/2+"px"},"500");
					}
					else if(l>80&&t<80){
						img.css("z-index",-7+i);
						img.css("-webkit-animation","rotate .3s linear 0 1 forwards");
						img.css("animation","rotate .3s linear 0 1 forwards");
						img.animate({left:"+="+w*n+"px"},500);
					}
					else if(l>750&&t<750){
						img.css("-webkit-animation","rotate3 .3s linear 0 1 forwards");
						img.css("animation","rotate3 .3s linear 0 1 forwards");
						img.animate({left:"+="+w*n+"px"},400);
					}
					else{
						img.animate({left:"+="+w*n+"px"},"500");
					}
				}
				else{
					if(i<count1-1||i>count2){
						img.animate({left:"+="+w*n/2+"px"},"500");
					}
					else if(l<80&&t>80){
						img.css("-webkit-animation","rotate2 .3s linear 0 1 forwards");
						img.css("animation","rotate2 .3s linear 0 1 forwards");
						img.animate({left:"+="+w*n+"px"},"500");
					}
					else if(l<750&&t>750){
						img.css("-webkit-animation","rotate4 .3s linear 0 1 forwards");
						img.css("animation","rotate4 .3s linear 0 1 forwards");
						img.css("z-index",-i);
						img.animate({left:"+="+w*n+"px"},500);
					}
					else{
						img.animate({left:"+="+w*n+"px"},"500");
					}
				}
			}
			if(n<0){
				count1++;
				count2++;
			}
			else{
				count1--;
				count2--;
			}
		}
		else if(e.detail){
			if(e.detail>0)n=-1;
			else n=1;
			$("img",this).stop(true,true);
			var left1=$("img:first",this).offset().left;
			var left2=$("img:last",this).offset().left;
			var left=123;
			if((left1>w-1&&n>0)||(left2<3*w+1&&n<0))
				return;
			$("img",this).animate({"left":"+="+w*n+"px"});
		}
    }
    //点击显示图片
    	$("#popup_bottom").click(function(){
			$("#popup,#origin_pic,#origin_pic img").hide();
		});
		$("#origin_pic img").css({"max-width":$(window).width()/2+"px","max-height":$(window).height()/2+"px"});
		$(window).resize(function(){
			base=$(document).width();
			$("#origin_pic img").css({"max-width":$(window).width()/2+"px","max-height":$(window).height()/2+"px"});
			if($("#origin_pic").css("display")!="none"){
				var pich=parseInt($("#origin_pic img").css("height"));
				var picw=parseInt($("#origin_pic img").css("width"));
				$("#origin_pic").css({marginTop:-pich/2+"px",marginLeft:-picw/2+"px"});
			}
		});
    	$("#pic_box img").click(function(){
		$("#popup,#origin_pic").show();
		var s=$(this).attr("src");
		if($("#origin_pic img").attr("src")==s){
			var pich=parseInt($("#origin_pic img").css("height"));
			var picw=parseInt($("#origin_pic img").css("width"));
			$("#origin_pic").css({marginTop:-pich/2+"px",marginLeft:-picw/2+"px"});
			setTimeout(function(){$("#origin_pic img").show();},100);
		}
		else{
			$("#origin_pic img").attr({"src":s});
		}
		$("#origin_pic img").load(function(){
			var pich=parseInt($("#origin_pic img").css("height"));
			var picw=parseInt($("#origin_pic img").css("width"));
			$("#origin_pic").css({marginTop:-pich/2+"px",marginLeft:-picw/2+"px"});
			setTimeout(function(){$("#origin_pic img").show();},100);
		});
	});
}