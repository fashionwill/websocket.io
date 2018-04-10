var systemSetup = (function(){
    var systemSetup = function(options){
        document.addEventListener('touchmove',function(event){event.preventDefault()},true);//禁止页面滑动
        this.browserSystem(options||{});
        this.ChatLogicFun(options||{});
    }
    systemSetup.prototype = {
        //判断访问终端
        browserSystem:function(options){
            var browser={
                versions:function(){
                    var u = navigator.userAgent,app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                        ucBrowser:u.indexOf('UCBrowser')> -1 ,//判断手机端UC浏览器
                        sogouMobileBrowser:u.indexOf('sogoumobilebrowser')> -1 ,//判断手机端UC浏览器
                        qq:u.indexOf('QQ')> -1 ,//判断手机端UC浏览器
                        qq: u.match(/\sQQ/i) == " qq" //是否QQ
                    };
                }(),
                language:(navigator.browserLanguage || navigator.language).toLowerCase()
            }
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
                this.monitorKeyboardIos(options);
            } else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
                
            } else {  //pc
                console.log(navigator.userAgent);
            };
        },
        //监听苹果手机键盘提起和关闭
        monitorKeyboardIos:function(options){
            this.options = options;
            /*
                @监听苹果手机系统默认键盘提起或者关闭
                @   focusin:表示提起
                @   focusout:表示关闭
             */
            $("#ChatContenttext").on("focusin",function(){
                    if(navigator.userAgent.indexOf('UCBrowser') > -1){
                        $("body,html").height("327");
                    }else if(navigator.userAgent.indexOf('Safari') > -1){
                        $("body,html").height("295");
                    }else if(navigator.userAgent.indexOf('MicroMessenger') > -1){
                        $("body,html").height("301");
                    }else if(navigator.userAgent.indexOf('QQ') > -1){
                        $("body,html").height("301");
                    }else if(navigator.userAgent.indexOf('SogouMobileBrowser') > -1){
                        $("body,html").height("345");
                    }else{
                        $("body,html").height("301");
                    }
                    $(window).scroll(function(){
                        $(window).scrollTop(0);
                    });
                    setTimeout(function(){
                        $(window).scrollTop(0);
                    },50);
                    $(".more_ways_foo,.regretlist,.fxied-right .key").hide();
                    $(".keyboard").show();
                    if($(".chat-info-list").outerHeight(true)>$(".scroll-wrap").outerHeight(true)){
                        var scrollh = $(".chat-info-list").outerHeight(true) - $(".scroll-wrap").outerHeight(true);
                        mui('#ChatViewScroll').scroll().scrollTo(0,-scrollh,0);
                    }
            });
            $("#ChatContenttext").on("focusout",function(){
                $("body,html").height($(window).outerHeight(true));
                if($(".bottom-fxied")>80){
                    var scrollh = $(".chat-info-list").outerHeight(true) - $(".scroll-wrap").outerHeight(true);
                    mui('#ChatViewScroll').scroll().scrollTo(0,-scrollh,0);
                }
            });
        },
        //监听安卓手机键盘提起和关闭
        monitorKeyboardAnd:function(evtand){
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var resize = function(){
                var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if(clientHeight > nowClientHeight){
                    //键盘弹出的事件处理
                }else{
                    //键盘收起的事件处理
                }
            };
        },
        /* 聊天发送消息的函数操作 */
        ChatLogicFun:function(options){
            //点击笑脸图标
            $(".keyboard").on("tap",function(){
                $(".fxied-right .key").show();
                $(this).hide();
                $(".regretlist").slideDown();
                $(".more_ways_foo").slideUp();
                $("#ChatContenttext").blur();
            })
            //点击+图标
            $(".more_ways_icon").on("tap",function(){
                $(".more_ways_foo").slideToggle();
                $(".regretlist").slideUp();
                $(".fxied-right .key").hide();
                $(".keyboard").show();
                $("#ChatContenttext").blur();
            })
            //点击键盘图标
            $(".fxied-right .key").on("tap",function(){
                $(".more_ways_foo,.regretlist").slideUp();
                $(this).hide();
                $(".keyboard").show();
                $("#ChatContenttext").focus();
            })
        }
    }
    return systemSetup;
})();