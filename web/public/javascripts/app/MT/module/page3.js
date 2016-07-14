define(function (require, exports, module) {

    var verify = require("./verify");
    var _method = require("../../../../cmdmodule/sku/_method");
    var shareFn = require('./to_share');
    var  popTips=require('./popTips');

    var page3 = {
        init: function (args) {
            var that = this;
            that.camp = args.camp;    //如果没有cookie,  则为用户第二页选择过的阵营
            that.status = args.status;   //如果没有cookie, 为0
            that.phone = args.phone;   //如果没有cookie, 为空


            //如果用户之前已经预约过
            if (that.status == "1") {
                that.haveSigned();
            }
            // 如果用户之前没有预约过
            else {
                that.haveNotSigned()
            }
            that.shareBtn();
            that.toggleMask();
            that.download();
        },


        

        //遮罩
        toggleMask: function () {
            var that = this;
            $('.leftFix').on('click', function () {
                $('.mask').show();
            });
            $('.closeBtn').on('click', function () {
                $('.mask').hide();
            })
        },

        //分享按钮和slg
        shareBtn: function () {
            var that = this;
            
            //文字显示
            if (that.camp == 'lm') {
                $('.head_slg img').attr('src', 'http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/slg_lm.png')

                $('.page3 .btnWraper .share').text("分享 呼喊联盟来战");
                $('.textWraper .head:first-child').text("—— 分享 召唤联盟小伙伴 ——");
                $('#shareBtn').on('click', function () {

                    shareFn.init({
                        obj: $(this),
                        method: _method,
                        camp:"联盟"
                    })
                })
            }
            else {
                $('.head_slg img').attr('src', 'http://image.uc.cn/s/uae/g/0y/ngp_gamespe/MT/slg_bl.png');
                $('.page3 .btnWraper  .share').text("分享 呼喊部落来战");
                $('.textWraper .head:first-child').text("—— 分享 召唤部落小伙伴 ——");
                $('#shareBtn').on('click', function () {
                    shareFn.init({
                        obj: $(this),
                        method: _method,
                        camp:"部落"
                    })
                })
            }
            //分享事件
         
        },


 
        //用户有cookie
        haveSigned:function(){
            var that=this;
            if($('.midSection .download').length==0)
            {
                $('#sendAjax').attr('lock',1);
                var reg=/^(\d{3})(\d{4})(\d{4})$/ig
            $('.midSection').append('<p class="notice">您的手机号' + that.phone.replace(reg,function(number,$1,$2,$3){return $1+'****'+$3})+ '之前已经预约过了</p>')
            $('.reservationDialog').remove();
            }
            else{
                $('.reservationDialog').remove();
            }
        },

        //用户没有cookie
        haveNotSigned:function() {
            var that = this;
            verify.init({camp: that.camp})
        },

        download:function(){
            $('.midSection .download').on('click',function(){
                _method.toclick({obj:$(this),wxattr:"download"})
            })
        }
    }

    module.exports = page3

});