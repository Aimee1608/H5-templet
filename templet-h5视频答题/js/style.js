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


function ImgLoadingByFile(imgArray,loadPageID,loadTxtID,showpageID){
    function complete(long){
        var timer = setTimeout(function(){
            $('#'+loadPageID).hide();
            $('#'+showpageID).show();


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
        $('#page-landscape').hide();

        var imgFile = [
            "img/bg.png",
            "img/share.jpg",
            "img/phone.png"
        ];
        ImgLoadingByFile(imgFile,'loadingPage','loadTxt','pageContainer');
        playHandle();
        firstInit = false;
    }else {
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();
    }


}

function playHandle(){
    var initData = {
        chosedNum:0,//答了多少题
        QArr:[//题目和答案类容：id:题目序号，title：题目，right:真答案，error:假答案，inner:配图，answer:题目答案，1表示right对，0表示error对
            {
                id:1,
                title:'老婆在追孙俪的那年花开，结果看着看着就跑偏了，竟迷恋起了邓超…',
                right:'邓超的微博堪称孙俪的广告位，实力宠妻太吸粉了',
                error:'别慌，没有DX3搞不定的老婆，买一辆它就成假新闻了',
                inner:'img/title01.png',
                answer:0
            },
            {
                id:2,
                title:'女同事上班看极限挑战被领导撞见，以为会被diss，没成想却是让她去联系张艺兴',
                right:'啊~~~东南DX3要请我老公来做代言了！！！',
                error:'真会搞事情，老太太不服就服你！这要是真的我直播跪榴莲',
                inner:'img/title02.png',
                answer:1
            },
            {
                id:3,
                title:'自从战狼破了55亿票房奇迹后，老板都快瘦成东南吴彦祖了',
                right:'当初拒绝了战狼的投资请求，要是我早哭的像个3百斤的孩子了',
                error:'一看就是中央戏精学院毕业的，直接给DX3打广告不好吗！我不介意',
                inner:'img/title03.png',
                answer:0
            },
            {
                id:4,
                title:'一男子觉得自己月月水逆，然后一狠心花了十万块钱去找大师破解，然并卵…',
                right:'明明不努力，偏要怪水逆！十万足够买辆DX3了，从此成为有志青年',
                error:'大师肯定是骗子，免费破水逆，加微…（微不了了！此处严禁贴小广告）',
                inner:'img/title04.png',
                answer:1
            },
            {
                id:5,
                title:'女孩在男乘客衣服上误留唇印，在网上向“大嫂”解释：太挤了，口误哈',
                right:'哈哈哈…掐指一算，大哥回家必有一难！远离这种尴尬你只需一辆DX3',
                error:'然后有无数大哥跟老婆说：你看吧，人家小妹妹都在网上向你解释了',
                inner:'img/title05.png',
                answer:1
            },
            {
                id:6,
                title:'张先生自驾去野生动物园惨遭老虎围攻，最后凭借超强的加速度突出重围，自救成功',
                right:'朋友们，这是一道送分题啊！因为他开的是…',
                error:'开的是东南DX3是吧？哼哼，这点套路，我都会抢答了',
                inner:'img/title06.png',
                answer:0
            },
            {
                id:7,
                title:'都说没拿过奖的人生是不完美的人生，无论什么奖…',
                right:'这还不简单，谁还没得过几朵小红花似的',
                error:'这么说不公平！车生亦如此好伐，DX3拿奖到手软~',
                inner:'img/title07.png',
                answer:0
            },
            {
                id:8,
                title:'我女朋友买了DX3的“真心橙”后就想和我分手，说我名字不对…',
                right:'不…不会是我们东南总经理惹的祸吧，他名字谐音真心橙（捂脸）',
                error:'都是借口！真相只有一个，有了DX3她会停车了！',
                inner:'img/title08.png',
                answer:0
            },
            {
                id:9,
                title:'一朋友哭着说：路边的蔬菜你不要捡！否则就会发展出一个丈母娘，最后还让你买套房…',
                right:'套路太深，防不胜防啊…教你一招，开着DX3没房丈母娘也喜欢~',
                error:'捡把蔬菜就能赠个媳妇，还有这种好事？！在哪捡的我也蹲点去',
                inner:'img/title09.png',
                answer:1
            },
            {
                id:10,
                title:'有一位奇葩的相亲女说：长江以北全是农村，我不要！',
                right:'我要回农村，城市套路深！',
                error:'我是东南的，我就不这样，我们的DX3想和全国人民交朋友',
                inner:'img/title10.png',
                answer:0
            },
            {
                id:11,
                title:'一位资深球迷在看完那场赢了比赛却输了世界杯的直播后，哭着喊了一句：国足牛B，这次是站着死的！',
                right:'向前跑，不再有冷眼和嘲笑~9月，DX3与你一起，为国足喝彩！',
                error:'你会不会忽然的出线，也许在未来的很多年，我都等着看！',
                inner:'img/title11.png',
                answer:1
            },
            {
                id:12,
                title:'一位初入职场的小哥总被自己有车的领导蹭车，怕被潜规则就辞职了',
                right:'哈哈哈，看过后续报道，人家蹭车只是想给儿子也买一辆DX3而已',
                error:'现在的年轻人都这么嚣张了吗，刚工作就有车…我不信！！！（人家不贵好吧）',
                inner:'img/title12.png',
                answer:1
            },
            {
                id:13,
                title:'胡歌说自己的处女座原则：我可以脏乱但你一定要干净（连霸道都这么迷人）',
                right:'你长得好看你说什么都对（微笑）',
                error:'这可能是个假处女座…不是该力求完美吗，比如汽车中的处女座DX3',
                inner:'img/title13.png',
                answer:0
            },
            {
                id:14,
                title:'听说一小学生拿父母手机给女主播打call，狠刷十几万的礼物',
                right:'俗话说养娃不遛娃，不是好爸爸！DX3赐给你光辉家长的力量！',
                error:'吓得我攥紧了自己只剩100块的卡，哎…忘了自己还没对象呢',
                inner:'img/title14.png',
                answer:1
            },
            {
                id:15,
                title:'以前是女朋友追着喊：选我还是选游戏，现在成男友求她放下农药远离手机',
                right:'小乔李白我们走，有了农药谁还稀罕蓝朋友！',
                error:'那是你没有一辆DX3，兜风耍帅让你瞬间两米八，农药算个啥！',
                inner:'img/title15.png',
                answer:0
            }
        ],
        chosed:false,//是否按了对错按钮
        score:0,//当前的分数
        randNum:null,//随机的index
        nowNum:['第一题','第二题','第三题','第四题','第五题'],//第多少题了
        ranAnimate:['page-03-an01','page-03-an02','page-03-an03','page-03-an04','page-03-an05'],
        item:null,//随机抽取的题目
        firstInit:true,
        answerNow:null
    };

    var videoP = document.getElementById('videoPlayer');
    videoP.controls=false;
    var time01 = true,time02 = true,time03 = true,time04 = true,time05 = true;
    $('video').show();
    videoP.pause();
    videoP.currentTime = 0.01;
    //控制当前播放的时间，移除播放器
    videoP.addEventListener("timeupdate",function(){
        console.log(this.currentTime);
        //if(this.currentTime>=10.2){
        //    $('.activeInfo').show();
        //    $('#videoPlayer').hide();
        //    videoP.volume = 0;
        //
        //    var timer = setTimeout(function(){
        //        videoP.pause();
        //        videoP.currentTime =0;
        //    },100)
        //}
        if(this.currentTime>=3.2&&time01){
            answerQ();
            time01 = false;

        }
        if(this.currentTime>=12&&time02){
            answerQ();
            time02 = false;

        }
        if(this.currentTime>=24&&time03){
            answerQ();
            time03 = false;

        }
        if(this.currentTime>=36&&time04){
            answerQ();
            time04 = false;

        }
        if(this.currentTime>=48&&time05){
            answerQ();
            time05 = false;

        }
    });
    function answerQ(){
            if(initData.chosedNum>=initData.QArr.length){
                return false
            }
            var item = initData.QArr[initData.chosedNum];
            var answer = item.answer==0?item.error:item.right;

            var html = '<h2>'+(initData.chosedNum+1)+"、 "+item.title+'</h2>\
                    <ul>\
                       <li>\
                            <input type="radio" name="question" id="right" value="'+item.right+'"/>'+'<label for="right">'+item.right+'\
                        </label></li>\
                        <li>\
                            <input type="radio" name="question" id="error" value="'+item.error+'"/>'+'<label for="error">'+item.error+'\
                        </label></li>\
                    </ul>';

            $('.Qbox').html(html).show();
            var timer = setTimeout(function(){
                $('.Qbox').hide();
                if($('input[name="question"]:checked').val()==answer){
                    $('.Abox').html("答对了").show();
                }else{
                    $('.Abox').html("答错了").show();
                }
                var timer02 = setTimeout(function(){
                    $('.Abox').hide();
                    clearTimeout(timer02);
                },3000);
                clearTimeout(timer);
            },5000);
            initData.chosedNum++;
    }


    $('#playAgain').click(function(){
        videoP.play();
        $('#videoPlayer').show();
        $('.activeInfo').hide();

    });
    $('#shareBtn').click(function(){
       $('.shareBg').show();
    });
    $('.shareBg').click(function(){
        $(this).hide();
    });
    //开始播放视频
    $('.playerBtn').click(function(){
        $(this).hide();
        if( videoP.paused){
            //$('video').css({'width':'100%'});
            videoP.play();
        }else{
            videoP.pause();
        }
    });
}


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