## release
- fis3 release development --dest ./portal -wLc             //本地联调环境构建，livereload.js常驻实时刷新;
- fis3 release development --dest ./portal -c                 //dev,test环境 （上ftp）;
- fis3 release --dest ./portal -c                     //本地预览下生产环境
- fis3 release prod --dest ./portal -c               //生产环境 (因为vue的后编译和fis3冲突，因此图片hash关闭)

## server start
- fis3 server start --www ./portal
- fis3 server start --root ./portal

`PORT=8080 NODE_ENV=dev npm start`  //自定义端口,自定义web代理环境[dev, development, fix, beta, stg, release]；

## env set
- development (`内网`开发环境,对应请求后端服务`xxx.hd`,[`默认`]) 
- dev (`外网`开发环境,对应请求后端服务`xxx.htmimi.cn`)
- beta (测试环境)
- fix (预演环境)
- stg (预发布环境)
- release (生产环境)

### cmd format：
- 启用模块化、配置模块化范围、加载插件；

### amd format：
无需fis3配置，采用browser模式查看require.js文档使用即可 (手动模块化)

### realease
1.html模板引擎ejs； //todo 和java沟通改配置？
2.sass编译； //todo compass 发布路径用url解决
3.js编译，模块化；  
    Q:绝对路径问题，上线后的绝对地址和本地不一样？
        A：
    Q:开启md5后补全时依赖文件的路径和产出的路径不一致？
        A：module文件不md5
    Q:包含require的被转换成a？
        A：module文件不混淆；
4.图片
5.打包
6.静态资源压缩、混淆
7.静态资源加md5码