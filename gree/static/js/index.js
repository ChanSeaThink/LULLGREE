window.onload=function(){
    	$("#intro div").mouseover(function(){
    		var s=$("img",this).attr("src").replace(/\.png/,"2.png");
    		$("img",this).attr({"src":s});
    	});
    	$("#intro div").mouseout(function(){
    		var s=$("img",this).attr("src").replace(/2\.png/,".png");
    		$("img",this).attr({"src":s});
    	});
}