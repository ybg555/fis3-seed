## release
- fis3 release development --dest ./portal -wLc     //本地联调环境构建，livereload.js常驻实时刷新;
- fis3 release development -d ./portal -c           //dev,test环境 （上ftp）;
- fis3 release -d ./portal -wLc                     //本地预览下生产环境
- fis3 release prod --dest ./portal -c              //生产环境 (因为vue的后编译和fis3冲突，因此图片hash关闭)

## server start
- fis3 server start --www ./portal
- fis3 server start --root ./portal
- `PORT=8080 NODE_ENV=dev npm start`  //自定义端口,自定义web代理环境[dev, development, fix, beta, stg, release]；

## env set
- development (`内网`开发环境,对应请求后端服务`xxx.hd`,[`默认`]) 
- dev (`外网`开发环境,对应请求后端服务`xxx.htmimi.cn`)
- beta (测试环境)
- fix (预演环境)
- stg (预发布环境)
- release (生产环境)

### cmd：
- 启用模块化、配置模块化范围、加载插件；

###components
1. fis3 install安装组件到本地，本地通过fis3-hook-components加载本地组件； 
2.    <script src="boostrap/button.js"></script> or require(['bootstrap', 'bootstrap/button']); 2种写法；

### realease
1. html模板引擎ejs； //todo 和java沟通改配置？
2. sass编译； //todo compass 发布路径用url解决
3. js编译，模块化；(不打包)  
    Q:绝对路径问题，上线后的绝对地址和本地不一样？
        A：默认用id，moduleId可覆盖；（一般ID够用了）
    Q:开启md5后补全时依赖文件的路径和产出的路径不一致？
        A：module文件不md5
4. 图片
5. 打包（打包正常，不打包第三步有问题，主要是路径：hash后的路径和依赖的路径不一致，依赖载入先完成，hash后的也没同步更新）
6. 静态资源压缩、混淆
7. 静态资源加md5码
8. 上线路径检查(静态资源用url，模块化js用id解决)
9. zip（有权限后做）