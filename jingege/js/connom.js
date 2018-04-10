//写cookies
function setCookie(name,value){ 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 

//读取cookies 
function getCookie(name){ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2])
    }else{
        return null;
    }
} 

//删除cookies 
function delCookie(name){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
    }
}

//获取字符长度（兼容中英文）
function getStrLength(str) {
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        return unescape(r[2]);
    }
    return null;
}