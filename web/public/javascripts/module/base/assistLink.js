/**
* 封装asslink --- 阿里游戏
* @author wwl98670@alibaba-inc.com
* @version 1.0.0 ### 20160323
* @update 
* @depend 导入fastclick
*/ 
define(function (require, exports, module) {
    
    require('./fastclick').attach(document.body);

    function _assistLink(obj){
        var href = obj.attr('href') && $.trim(obj.attr('href'));
        window.location.href = href;
    }
     
    // 触摸反馈   
    function _touchHover(e,f){
            var d = e.className;
          f = !f ? "press": f;
      e.className = d + " " + f;
            document.addEventListener("touchend", c, false);
      document.addEventListener("touchmove", c, false);
      function c() {
                e.className = d;
        document.removeEventListener("touchmove", c, false);
        document.removeEventListener("touchend", c, false)
      }
        };
        
        // 绑定touch反馈
        $(document).on('touchstart','[type="btn"]', function(){
                _touchHover(this);
        });
        // 绑定click
    $(document).on('click','[type=btn][href]', function(){
            _assistLink($(this));
    });
		

});