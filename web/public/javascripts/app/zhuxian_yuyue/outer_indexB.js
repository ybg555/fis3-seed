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
            that.initFormulatedData();
            that.dataFormulating();
            that.eventBinding();
        },




        slidepic: function(){
            if ( $("#slidePic").length > 0 ) {
                var _slidepicFn =  require('./module/slidepic_fun.js');
                _slidepicFn.init({
                    wrap: $("#slidePic")
                });
            }
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
        initFormulatedData:function(){
            var date,halfHourGap, randomSeed, baseNumber, standardDate, formulatedNumber;
            baseNumber=26887;
            standardDate=new Date(2016,5,1,0,0,0);
            date = new Date();
            halfHourGap= (date.getTime()-standardDate.getTime())/((1000*60*30));
            formulatedNumber =Math.round(baseNumber + 100*halfHourGap);
            $(".haveBooked").text(formulatedNumber+"位仙迷已经预约");
        },
        eventBinding:function(){
            $('#bookBtn').on('click',function(){
                _method.toclick({obj:$(this)});
            })
        }
    }
    page.init();

});