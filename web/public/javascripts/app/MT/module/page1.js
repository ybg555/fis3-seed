define(function (require, exports, module) {
    var _method = require("../../../../cmdmodule/sku/_method");

    

    var  page1={
        init: function () {
            var that = this;
            that.eventBind();
        },

        eventBind:function(){
            $('.sloganWraper_26 img').on('click',function(){
                        _method.toclick({obj:$(this),wxattr:"download"})
            })
        }
    }

    module.exports = page1;
})