/******rem *******/
(function(win){
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid,
        hasRem = true;
    hasZoom = true;
    designWidth = 750;
    function refresh(){
        var width = docEl.getBoundingClientRect().width;
        if(hasRem){
            var rem = width/10;
            docEl.style.fontSize = rem + "px";
            remCalc.rem = rem;
            var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
            if(actualSize!== rem && actualSize>0 && Math.abs(actualSize-rem)>1){
                var remScaled = rem*rem/actualSize;
                docEl.style.fontSize = remScaled + "px";
            }
        }
        if(hasZoom){
            var style = document.getElementById('y_style');
            if(!style){
                style = document.createElement('style');
                style.id = 'y_style';
            }
            style.innerHTML = '._z{zoom:'+ width/designWidth + '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
    function dbcRefresh(){
        clearTimeout(tid);
        tid = setTimeout(refresh,100);
    }
    win.addEventListener("resize",function(){
        dbcRefresh()
    },false);
    win.addEventListener("pageshow",function(e){
        if(e.persisted){
            dbcRefresh()
        }
    },false);
    refresh();
    if(hasRem){
        remCalc.refresh = refresh;
        remCalc.rem2px = function(d){
            var val = parseFloat(d)/this.rem;
            if(typeof d==="string" && d.match(/px$/)){
                val+="rem";
            }
            return val
        };
        win.remCalc = remCalc;
    }
})(window);
/*********留资************/
var SaveInfo = {
    username:null,//name,name
    sex:"男",
    phone:null,//mobile,mobile
    cartype:null,//interested,car_type
    province:null,//province,dealer_name省份，城市，经销商（1,2,3）
    city:null,//city,无
    source:null,//source,source,123
    cartime:null,
    checked:false,
    init:function(){
        function GetQueryString(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null&&r!=undefined)return  unescape(r[2]); return null;
        }
        SaveInfo.source = GetQueryString('source')==null?'jrtt':GetQueryString('source');
        SaveInfo.updateView();
    },
    updateView:function(){
        SaveInfo.inputReg();
        SaveInfo.submit();
        $('select').on('touchstart',function(){
            $(this).find('option[value="-1"]').attr('disabled','disabled');
        });
        $('select').change(function(){
            $(this).addClass('changed');
        })
    },
    inputReg:function(){
        $('input[name="username"]').blur(function(){
            var val = $(this).val();
            var reg =/^[a-zA-Z\u4E00-\u9FA5]*$/;
            console.log(reg.test(val));
            if(val!=""&&val!="test"&&val!="空白"&&val!="Unknown"&&val!="未知"&&val!="未告知"&&this.validity.valid&&reg.test(val)){
                //$(this).parent().removeClass('red');
                $(this).attr('placeholder','姓名');
                $(this).removeClass('inputerror');
            }else{
                //$(this).parent().addClass('red');
                $(this).val('');
                $(this).attr('placeholder','请您正确输入姓名');
                $(this).addClass('inputerror');
            }
        });


        $('input[name="phone"]').blur(function(){
            var reg = /^1[34578]\d{9}$/;
            var val = $(this).val();
            if(isNaN(parseFloat(val))){
                $(this).val('');
                //$(this).parent().addClass('red');
                $(this).attr('placeholder','请您输入手机号');
                $(this).addClass('inputerror');
            }else{
                if(reg.test(val)){
                    //$(this).parent().removeClass('red');
                    $(this).attr('placeholder','手机号');
                    $(this).removeClass('inputerror');

                }else{
                    $(this).val('');
                    //$(this).parent().addClass('red');
                    $(this).attr('placeholder','请您正确输入手机号');
                    $(this).addClass('inputerror');
                }
            }

        });

    },
    clickReg:function(){
        var usernameReg = false,phoneReg = false,provinceReg = false,cityReg = false,cartypeReg = false,cartimeReg = false,sexReg = false;
        var inputUsername = document.getElementById('username');
        if(inputUsername.validity.valid){
            usernameReg = true;
        }else{
            usernameReg = false;
        }
        var reg = /^1[34578]\d{9}$/;
        if(reg.test($('input[name="phone"]').val())){
            phoneReg = true;
        }else{
            phoneReg = false;
        }
        function selectReg(selectName){
            var val = $('select[name='+selectName+'] option:selected').val();
            var reg;
            if(val&&val!=-1){
                reg = true;
            }else{
                reg = false;
            }
            return reg;

        }
        provinceReg = selectReg('ddlProvince');
        cityReg = selectReg('ddlCity');
        cartypeReg = selectReg('cartype');
        cartimeReg = selectReg('cartime');
        sexReg = selectReg('sex');
        var total = usernameReg&&phoneReg&&provinceReg&&cityReg&&cartypeReg&&cartimeReg&&sexReg;
        console.log(usernameReg,phoneReg,provinceReg,cityReg,cartypeReg,cartimeReg,sexReg);
        console.log(total);
        return total;
        //return true;
    },
    submit:function(){
        $('#btn-userInfo').on('click',function(e){
            e.preventDefault();
            $(".alert").click(function(){
                $(".alertBox").fadeOut(300);
                $('.btn-userInfo').addClass('btn-move');
            });
            if(SaveInfo.clickReg()){

                SaveInfo.username = $('input[name="username"]').val();
                SaveInfo.phone = $('input[name="phone"]').val();

                SaveInfo.cartype = $('select[name="cartype"] option:selected').val();

                SaveInfo.province = $('select[name="ddlProvince"] option:selected').val();

                SaveInfo.city = $('select[name="ddlCity"] option:selected').val();

                SaveInfo.dealerName = $('select[name="agency"] option:selected').val();

                SaveInfo.cartime = $('select[name="cartime"] option:selected').val();
                SaveInfo.sex = $('select[name="sex"] option:selected').val();
                // 发起Ajax调用
                var xyData = {
                    name:SaveInfo.username,
                    mobile:SaveInfo.phone,
                    sex:SaveInfo.sex,
                    car_type:SaveInfo.cartype,
                    dealer_name:SaveInfo.province+','+SaveInfo.city+','+SaveInfo.dealerName,
                    source:SaveInfo.source,
                    buy_time:SaveInfo.cartime,
                    chart:'user_benc'
                };
                console.log(xyData);
                $.ajax({
                    type:'get',
                    url:'https://h5api.xingyuanauto.com/userinfo',
                    data:xyData,
                    dataType:'json',
                    success:function(msg){
                        console.log(msg);
                        if(msg.code==1001){
                            $(".success").show();
                            $('.btn-userInfo').removeClass('btn-move');
                            $('select option[value="-1"]').attr('disabled',false);
                            $('#userForm')[0].reset();
                            $('select').removeClass('changed');
                        }else if(msg.code==1003){//已注册
                            $(".repace").show();
                            $('.btn-userInfo').removeClass('btn-move');
                        }else if(msg.code==1005){//重复提交
                            $(".repaceagain").show();
                            $('select option[value="-1"]').attr('disabled',false);
                            $('.btn-userInfo').removeClass('btn-move');
                            $('#userForm')[0].reset();
                        }else{
                            $(".error").show();
                        }
                    }
                });
            }else{
                $(".error").show();
                //alert('请完善信息');
            }

        });
    }
};

$(function(){
    //活动详情
    ProvinceData.init('ddlProvince','ddlCity','agency');
    SaveInfo.init();

});

function ImgLoadingByFile(imgArray,loadPageID,loadTxtID,showpageID){
    function complete(long){
        var timer = setTimeout(function(){
            $('#'+loadPageID).hide();
            $('#'+showpageID).show();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                direction: 'vertical',
                onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
                    swiperAnimateCache(swiper); //隐藏动画元素
                    swiperAnimate(swiper); //初始化完成开始动画
                },
                onSlideChangeEnd: function(swiper){
                    //console.log(333);
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画


                }
            });
            $('.arrow').click(function(){

                swiper.slideNext();
            });
            clearTimeout(timer);
        },long);
    }
    if(sessionStorage.getItem("pageloaded")){
        $('#'+loadTxtID).html('100%');
        complete(1300);
    }else{
        var imgLoad = 0;
        var btime = new Date();
        if(imgArray.length>0){
            var imgTotal = imgArray.length;
            var percent = 0;
            var img = [];
            for(var i = 0;i<imgArray.length;i++){
                img[i] = new Image();
                img[i].src=imgArray[i];
                img[i].onload = function(){
                    imgLoad++;
                    percent = parseInt(imgLoad/imgTotal*100);
                    $('#'+loadTxtID).html(percent+'%');
                    console.log(percent);

                    if(percent>=100){
                        var etime = new Date();
                        console.log(etime-btime);
                        if(etime-1000>btime){
                            complete(100);
                        }else{
                            complete(200);
                        }
                        //alert(etime-btime);

                        sessionStorage.setItem("pageloaded", "true");

                    }
                }
            }
        }
    }
}

//横屏
function landscape(){
    //var w = window.innerWidth;
    //var h = window.innerHeight;
    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    $("body").css({"width":w,"height":h});
    $('#page-landscape').css({"width":w,"height":h}).show();
    $('#page-portrait').css({"width":w,"height":h});
    //$('#page-landscape').show();

}
var firstInit = true;
//竖屏
function portrait(){

    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    //初始化加载
    if(firstInit){
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-portrait').show();
        $('#page-landscape').hide();

        var imgFile = [
            "img/bg.png",
            "img/share.jpg",
            "img/music-close.png",
            "img/music-open.png",
            "img/phone.png"
        ];
        ImgLoadingByFile(imgFile,'loadingPage','loadTxt','pageContainer');
        firstInit = false;
    }else {
        //$('#page-portrait').show();
        //$('#page-landscape').hide();
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();
    }

}


/*********旋转横竖屏*********/
(function() {
    "use strict";

    function Utils() {
    }

    Utils.isWeiXin = function(){
        return navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/);
    };
    Utils.isQQ = function(){
        return navigator.userAgent.ua.match(/QQ\/([\d\.]+)/);
    };
    Utils.isQZone = function(){
        return navigator.userAgent.ua.indexOf("Qzone/") !== -1;
    };

    Utils.isIos = function() {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };
    Utils.isIPhone = function() {
        return navigator.userAgent.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    };
    Utils.isIpad = function() {
        return navigator.userAgent.indexOf('iPad') > -1;
    };
    Utils.isAndroid = function() {
        var u = navigator.userAgent;
        return navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    };
    Utils.isMobile = function() {
        // var u = navigator.userAgent;
        return navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) != null;
    };

    // ## 屏幕方向
    Utils.isPortrait = function() {
        if (!Utils.isMobile()) {
            //alert(111);
            return true;

        }
        // 安卓版 微信里面 只用判断 width 和 height
        if (Utils.isAndroid() && Utils.isWeiXin()) {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(22);
                return true;

            } else {
                //alert(331);
                return false;

            }
        }
        var orientation = window['orientation'];
        if (orientation||orientation==0) {
            if (orientation == 90 || orientation == -90) {
                //alert(4442);
                return false;

            }else{
                //alert(555111);
                return true;

            }
        } else {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(666111);
                return true;

            } else {
                //alert(777111);
                return false;

            }
        }
    };
    // ## jquery 获取 window 的宽度
    Utils.windowW = function() {
        // var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return $(window).width();
    };
    // ## jquery 获取 window 的高度
    Utils.windowH = function() {
        return $(window).height();
    };
    window.Utils = Utils;
}());
$(function(){
    onResize();
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", onResize, false);
    }else{
        window.addEventListener( "resize", onResize, false);
    }
});

function  onResize() {

    if(Utils.isPortrait()){
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){

            var timer = setTimeout(function(){
                portrait();

                clearTimeout(timer);
            },100);
        }else{
            portrait();
        }
    } else {
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            var timer = setTimeout(function(){
                landscape();
                clearTimeout(timer);
            },100);
        }else{
            landscape();
        }
    }
}