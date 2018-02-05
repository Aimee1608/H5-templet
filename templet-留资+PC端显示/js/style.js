
/**计算rem**/
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



/***用户注册留资
 来源渠道 source  值要动态获取当前路由的渠道值
 1 天津玩艺儿
 2 看天津
 3 天津生活通
 4 乐活北京
 5 石家庄本地通
 6 掌控沧州
 7 家在济南
 8 青岛圈
 9 晋城头条
 10 太原人微生活***/
var SaveInfo = {
    username:null,//name,name
    sex:"男",
    phone:null,//mobile,mobile
    cartype:null,//interested,car_type
    province:null,//province,dealer_name省份，城市，经销商（1,2,3）
    city:null,//city,无
    agency:null,//经销商
    cartime:null,//购车时间
    source:null,//source,source,123
    source_end:2,//来源端设备 1：PC 2：移动端
    chart:'user_buick201802',
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
            $(this).find('option[value="0"]').attr('disabled','disabled');
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
                $(this).attr('placeholder','姓名');
            }else{
                $(this).val('');
                $(this).attr('placeholder','请您正确输入姓名');
            }
        });


        $('input[name="phone"]').blur(function(){
            var reg = /^1[34578]\d{9}$/;
            var val = $(this).val();
            if(isNaN(parseFloat(val))){
                $(this).val('');
                $(this).attr('placeholder','请您输入手机号');
            }else{
                if(reg.test(val)){
                    $(this).attr('placeholder','手机号');

                }else{
                    $(this).val('');
                    $(this).attr('placeholder','请您正确输入手机号');
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
            if(val&&val!= 0){
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
            if(SaveInfo.clickReg()){

                SaveInfo.username = $('input[name="username"]').val();
                SaveInfo.phone = $('input[name="phone"]').val();

                SaveInfo.cartype = $('select[name="cartype"] option:selected').val();

                SaveInfo.province = $('select[name="ddlProvince"] option:selected').val();

                SaveInfo.city = $('select[name="ddlCity"] option:selected').val();

                SaveInfo.agency = $('select[name="agency"] option:selected').val();

                SaveInfo.cartime = $('select[name="cartime"] option:selected').val();
                SaveInfo.sex = $('select[name="sex"] option:selected').val();
                // 发起Ajax调用
                var xyData = {
                    name:SaveInfo.username,
                    mobile:SaveInfo.phone,
                    sex:SaveInfo.sex,
                    car_type:SaveInfo.cartype,
                    dealer_name:SaveInfo.province+','+SaveInfo.city+','+SaveInfo.agency,
                    source:SaveInfo.source,
                    buy_time:SaveInfo.cartime,
                    chart:SaveInfo.chart,
                    source_end:SaveInfo.source_end
                };
                //console.log('传参',xyData);
                $.ajax({
                    type:'get',
                    //url:'https://h5api.xingyuanauto.com/userinfo',//正式
                    url:'http://www.h5api.com/userinfo',//测试
                    data:xyData,
                    dataType:'json',
                    success:function(msg){
                        console.log('留资',msg);
                        if(msg.code==1001){
                            $(this).openWindow("提示","提交成功",['确定']);
                            $('select option[value="0"]').attr('disabled',false);
                            $('#userForm')[0].reset();
                        }else if(msg.code==1003){//已注册
                            $(this).openWindow("提示","该手机号已报名，请勿重复提交",['确定']);
                        }else if(msg.code==1005){//重复提交
                            $(this).openWindow("提示","请勿重复提交",['确定']);
                            $('select option[value="0"]').attr('disabled',false);
                            $('#userForm')[0].reset();
                        }else{
                            $(this).openWindow("提示","报名失败",['确定']);
                        }
                    },
                    error: function(msg){
                        $(this).openWindow("提示","网络异常",['确定']);
                        $('select option[value="0"]').attr('disabled',false);
                        $('#userForm')[0].reset();
                    }
                });
            }else{
                $(this).openWindow("提示","请完善信息",['确定']);
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



