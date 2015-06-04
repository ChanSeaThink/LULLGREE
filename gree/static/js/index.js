window.onload=function(){
    	$("#intro div").mouseover(function(){
    		var s=$("img",this).attr("src").replace(/\.png/,"2.png");
    		$("img",this).attr({"src":s});
    	});
    	$("#intro div").mouseout(function(){
    		var s=$("img",this).attr("src").replace(/2\.png/,".png");
    		$("img",this).attr({"src":s});
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
		PicAdjust(136,204,"#products_top")
}