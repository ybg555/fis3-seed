define(function (require, exports, module) {

    var  popTips={
        init: function (msg) {
            var that = this;
            $('.reservationTips').hide();
            $('.reservationTips').text(msg);
            $('.reservationTips').show();
        },
    }
    
    module.exports = popTips;
})