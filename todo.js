var updateTime=Number(document.getElementById("date").attributes["data-time"].value)*1000;
var tip=document.getElementById("tips");
var timestamp=new Date().getTime();
var aDay=3600*24*1000;
var days=Math.round((timestamp-updateTime)/aDay);
if(days==0){
	tip.innerHTML="w568w 刚刚才来看过博客呢！";
}else if(days<=7){
	tip.innerHTML="w568w 已经"+days+"天没来看过博客了，高二狗一周也只能更新一次呢...";
}else if(days<=14){
	tip.innerHTML="w568w 已经"+days+"天没来看过博客了，虽说高二狗一周能更新一次，但是他上周还是忘了呢，大概下周会加倍补回来吧？";
}else if(days<=30){
	tip.innerHTML="w568w 已经"+days+"天没来看过博客了，大概是在准备什么重要的考试吧？";
}else{
	tip.innerHTML="w568w 已经"+days+"天没来看过博客了，大概已经入土为安了(也可能是在拼命学习呢)";
}