define(function (require, exports, module) {
    var preload = require('./preload');
    var pageflip = require('./pageflip');
    var page3 = require('./page3');
    

    var page2 = {
        init: function () {
            var that = this;
            preload.init();
            that.eventBinding();
        },
        eventBinding: function () {
            var that = this;
            $('.page2 .mod-btn').bind('click', function ani() {
                // 防止动画完成前的多次点击
                $('.page2 .mod-btn').unbind();
                
                //写入统计参数
                $('.btnWraper .btn_right').attr({act_stat:'btn_wjmt3yy_choose_po-'+(2*that.count)})
                $('.btnWraper .btn_left').attr({act_stat:'btn_wjmt3yy_choose_po-'+(2*that.count-1)})



                var $message = $('<div class="message" ani-type="zoomOut"></div>');
                // 用户点击部落
                if ($(this).is('.btn_left')) {
                    that.choice['bl']++;
                    $message.text("部落支援+1")
                    $('.page2 .page-containter').append($message);
                    $('.message').attr("ani-type", "zoomOutQuick");
                }
                //用户点击联盟
                else {
                    that.choice['lm']++;
                    $message.text("联盟支援+1");
                    $message.addClass('lm');
                    $('.page2 .page-containter').append($message);
                    $('.message').attr("ani-type", "zoomOutQuick");
                }

                //不去掉ani-type属性,opacity的动画会存在问题
                $('.role').removeAttr('ani-type');
                $('.textWraper').removeAttr('ani-type');
                $('.role').animate({opacity: 0}, 1800, 'ease', function () {$(this).remove()});
                $('.textWraper_right').animate({opacity: 0}, 1800, 'ease', function () {});
                $('.textWraper_left').animate({opacity: 0}, 1800, 'ease', function () {
                    $('.message').remove();
                    //用户没有选够5组
                    if (that.count < 5) {
                        //回调开始
                        var $textWraper_left = $(this);
                        //下一组文字
                        $textWraper_left.find('.name').text(that.roleInfo[that.count]['bl']['name']);
                        $textWraper_left.find('.type').text(that.roleInfo[that.count]['bl']['type']);
                        $textWraper_left.find('.weapon').text(that.roleInfo[that.count]['bl']['weapon']);
                        $textWraper_left.find('.star').text(that.roleInfo[that.count]['bl']['star']);
                        var $textWraper_right = $textWraper_left.siblings('.textWraper_right');
                        $textWraper_right.find('.name').text(that.roleInfo[that.count]['lm']['name']);
                        $textWraper_right.find('.type').text(that.roleInfo[that.count]['lm']['type']);
                        $textWraper_right.find('.weapon').text(that.roleInfo[that.count]['lm']['weapon']);
                        $textWraper_right.find('.star').text(that.roleInfo[that.count]['lm']['star']);
                        $textWraper_left.animate({opacity: 1}, 1000, 'ease');
                        $textWraper_right.animate({opacity: 1}, 1000, 'ease');

                        //下一组角色
                        that.count++;
                        var imgNodeLeft = '<img src="http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/lm_' + that.count + '.png" alt=""  class="role role_left js_preload" style="left:-100%"/>';
                        var imgNodeRight = '<img src="http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/bl_' + that.count + '.png" alt="" class="role role_right js_preload" style="left:100%"/>';
                        $('.page2 .page-containter').append(imgNodeLeft, imgNodeRight);
                        $('.page2 .indicator').text(that.count+'/5')
                        //某个动画完成后才重置按钮&绑定事件
                        $('.role_left,.role_right').animate({left: 0}, 1000, 'ease',function(){
                            //事件重新绑定
                            $('.page2 .mod-btn').bind('click', ani);
                        });
                    }

                    //用户选够5组
                    else {
                        $message.remove();
                        $('.page2').removeClass('to_active');
                        $(".page2").next().addClass("page-item flip_page_item page3 to_active");
                        $(".page2").next().addClass("page-item flip_page_item page3 to_active");
                        pageflip.init();
                        pageflip.mainbg.css({
                            "-webkit-transform": "translateY(-200%)",
                            "transform": "translateY(-200%)",
                            "-webkit-transition": "-webkit-transform 800ms ease-in-out",
                            "transition": "transform 800ms ease-in-out"
                        });
                        pageflip.endFun($('.page3'))

                        //选择数联盟>部落
                        if(that.choice.bl<=that.choice.lm)
                        {
                            page3.init({camp:'lm'});
                            that.finalChoice ="lm";
                        }
                        //选择数联盟<部落
                        else
                        {
                            page3.init({camp:'bl'});
                            that.finalChoice ="bl";
                        }
                    }
                    // 回调结束
                })
            })
        },
        count: 1,
        roleInfo: [
            {
                "lm": {"name": "安度因洛萨", "type": "艾泽拉斯展示", "weapon": "剑", "战力": "4星"},
                "bl": {"name": "牛头人", "type": "兽族英勇战士", "weapon": "剑", "战力": "4星"}
            },
            {
                "lm": {"name": "人族", "type": "人类王国创造者", "weapon": "锤子", "战力": "3.5星"},
                "bl": {"name": "杜隆坦", "type": "部落守护之魂", "weapon": "斧头", "战力": "3.5星"}
            },
            {
                "lm": {"name": "卡德加", "type": "最强人类法师之一", "weapon": "法术", "战力": "4星"},
                "bl": {"name": "亡灵", "type": "亡者之最高法灵", "weapon": "法术", "战力": "3.5星"}
            },
            {
                "lm": {"name": "麦迪文", "type": "最伟大星界法师", "weapon": "法术", "战力": "5星"},
                "bl": {"name": "血精灵", "type": "高等暗夜精灵", "weapon": "法术", "战力": "4星"}
            },
            {
                "lm": {"name": "伽罗娜", "type": "半兽人传奇", "weapon": "剑", "战力": "3.5星"},
                "bl": {"name": "巨魔", "type": "邪恶庞大食人妖", "weapon": "弓箭", "战力": "3.5星"}
            }
        ],
        choice: {"bl": 0, "lm": 0}
    };
    module.exports = page2;
    
})