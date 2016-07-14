/**
 * @description: 诛仙预约 -- 九游大圣
 * @version: mochen.xm@alibaba-inc.com 1.0 ### 20160616
 * @author:
 */

define(function(require) {

    // 传递通用接口
    var _method = require('../../../cmdmodule/sku/_method.js');
    var pop = require('../../../cmdmodule/sku/pop');
    require("./module/flower");


    var page = {
        init: function(){
            var that = this;
            that.slidepic();
            that.initUUID();
            that.sendUUIDRequest();
            that.initFormulatedData();
            that.dataFormulating();
        },

        
        slidepic: function(){
            if ( $("#slidePic").length > 0 ) {
                var _slidepicFn =  require('./module/slidepic_fun.js');
                _slidepicFn.init({
                    wrap: $("#slidePic")
                });
            }
        },
        initUUID:function(){
            var uuid;

            if(get_ua.isNG){
                if(get_ua.isNGios)
                {
                    uuid = get_ua.isUA.match(/\bsi\/([^\s]+)\b/i)[1];
                }

                else if(get_ua.isNGandroid)
                {
                    uuid=JSBridge.callNative('NineGameClient', 'getEnv', {key:'uuid'});
                }
                // alert(uuid)
                $('#pageParam').attr('data-uuid',uuid);
            }

        },
        getPageParam:function(){
            var that=this;
            var $pageParam=$('#pageParam');
            var uuid = $pageParam.attr('data-uuid'),
                  activeId = $pageParam.attr('data-activeid'),
                  pageParamJson = {"uuid":uuid,"activeId":activeId};
            return pageParamJson;
        },
        sendUUIDRequest:function(){
                var that=this;
                var pageParamJson = that.getPageParam();
            $.ajax({
                type: "POST",
                url: $('#pageParam').attr('data-uuid-url'),
                data: pageParamJson,
                datatype:"json",
                timeout:6000,
                beforeSend: function(){
                    pop.loadpop("<img class='loading' src='http://image.uc.cn/s/uae/g/0y/ngp_gamespe/zhuxian_yuyue/loading.gif'/>预约中,请稍后...");
                },

                success: function(response){
                    if ( response && response.state && response.state.code ) {
                        var code = response.state.code;
                        if ( code == 2000000 ) {

                                pop.msgpop({lock:0,msgarr:["预约成功!",],btnarr:['确定'],callback:function(){}})
                                pop.addpopclose();
                                $('#bookBtn').addClass('success');
                        }

                        else {

                            pop.msgpop({lock:2,msgarr:["预约失败,请刷新页面重试!",],btnarr:['确定'],callback:function(){}})
                            pop.addpopclose();
                            pop.refreshpop();
                        }
                    }
                    else {
                        pop.msgpop({lock:2,msgarr:["网络状况不佳,请刷新页面重试!",],btnarr:['确定'],callback:function(){}})
                        pop.addpopclose();
                        pop.refreshpop();
                    }
                },
                error: function(xhr){
                    pop.msgpop({lock:2,msgarr:["预约失败,请刷新页面重试!",],btnarr:['确定'],callback:function(){}})
                    pop.addpopclose();
                    pop.refreshpop();
                }
            });

        },
        initFormulatedData:function(){
            var date,halfHourGap,  baseNumber, standardDate, formulatedNumber;
            baseNumber=26887;
            standardDate=new Date(2016,5,1,0,0,0);
            date = new Date();
            halfHourGap= (date.getTime()-standardDate.getTime())/((1000*60*30));
            formulatedNumber =Math.round(baseNumber + 100*halfHourGap);
            $(".haveBooked").text(formulatedNumber+"位仙迷已经预约");
        },
        dataFormulating:function(){
            var t,date,halfHourGap, randomSeed, baseNumber, standardDate, formulatedNumber;
                    baseNumber=26887;
                    standardDate=new Date(2016,5,1,0,0,0);

            t = setInterval(function(){
                     date = new Date();
                     halfHourGap= (date.getTime()-standardDate.getTime())/((1000*60*30));
                     randomSeed = Math.random()*20;
                    formulatedNumber =Math.round(baseNumber + 100*halfHourGap+randomSeed);
                    $(".haveBooked").text(formulatedNumber+"位仙迷已经预约");
            },1800000);
        },

    }
    page.init();
    
});