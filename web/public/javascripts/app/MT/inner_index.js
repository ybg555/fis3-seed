
define(function (require, exports, module) {

    var preload = require("./module/preload");
    var pageflip = require("./module/pageflip");
    var _method = require('../../../cmdmodule/sku/_method.js');
    var pop = require('../../../cmdmodule/sku/pop');
    
    //page2初始化
    var page= {
        init:function(){
            var that=this;
            pageflip.init();
            preload.init();
            that.initUUID();
            that.sendUUIDRequest();
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
            console.log(pageParamJson)
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
    }
    
    page.init();
    

});
