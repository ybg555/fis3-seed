define(function(require, exports, module) {

    var _preload_fun = require('./img_preload');
    var pageflip =  require('./pageflip');
    var page3 = require('./page3');
    
    var preload = {
        init: function () {
            var that = this;
            var winWidth = document.documentElement.clientWidth;
            if ( winWidth < 720 ){
                $("body").addClass("ismake");
                _preload_fun.init({
                    element: $(".js_preload"),
                    finishedFunc: function () {
                        setTimeout(function () {
                            $(".loader-wrapper").remove();
                            $(".page-list").css("display", "-webkit-box");
                            $(".flip_page_item").eq(0).addClass("to_active");
                            var $pageParam = $('#pageParam');

                            var status = $pageParam.attr('data-status'),
                                camp  = $pageParam.attr('data-camp'),
                                phone=$pageParam.attr('data-phone');

                            //如果用户之前已经预约过,则在预加载的时候抹掉第2页,并将用户的camp, status, phone等信息传入page3初始化
                            if(status=="1") {
                                $(".page2").remove();
                                $(".page1").next().addClass("page-item flip_page_item page3 to_active");
                                pageflip.init();
                                page3.init({camp:camp,status:status,phone:phone});
                            }

                            //如果之前用户未预约
                            else{
                                pageflip.init();
                            }
                        }, 400);
                    }
                });
            }

            else {
                $(".loader-wrapper,.flip_page_list ,#down_arr,#preload").remove();
                $("#pcPage").removeClass("hide");
                $("body").addClass("ispc");



            }
            
        }
    };
    module.exports = preload;
})