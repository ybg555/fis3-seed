/**
 * @author Blade
 * @date 2016/07/13
 */

var root = fis.project.getProjectPath();
console.info("root=>", root);
// 只需要编译 html 文件，以及其用到的资源。
//fis.set('project.files', ['*.html', 'map.json']);
fis.set('project.charset', 'utf8');
fis.set('project.res', '/portal/web/public');
fis.set('project.ignore', [
    'portal/**',
    'node_modules/**',
    'package.json',
    'fis-conf.js',
    'dev-express.js',
    'README.md',
    '.git/**',
    '.svn/**'
]);
fis.set('PC.res.date', Date.now());
fis.set('PC.res.domain', 'http://portal.ucgc.ucfly.com');
fis.set('PC.res.mobileDomain', 'http://a.9game.cn');
fis.set('PC.res.zip', '/portal/web');
fis.set('PC.res.css', '/public/stylesheets/android_new/dsp/collection/card');
fis.set('PC.res.js', '/public/javascripts/android_merge/dist/app/activity/dsp');
fis.set('PC.res.images', '/public/images/android_portal/activity/dsp/collection/card');
fis.set('PC.res.html', '/tpl/android_new/activity/dsp');


fis.match('tpl/(*.html)', {
    //release: '/template/$1'
    isHtmlLike: true,
    parser: fis.plugin('html-ejs', {})
});

fis.match('*.scss', {
    isCssLike: true,
    rExt: '.css',
    parser: fis.plugin('node-sass', {})
});

/**
 * js模块化构建流程
 * 1.指定模块化作用域(全部define都会补全)
 * 2.模块化补全和封装，别名配置等；（补全的路径问题是绝对值，依赖的路径是非hash的路径）
 * 3.过程中文件载入插件（生成静态资源表，完成按依赖打包，cmd只能根据html当前页全打包）
 */
fis.match('(*.js)', {
    //id: '$1',
    isJsLike: true,
    isMod: true,
    optimizer: null, //不能混淆，所有require会被转掉，无法载入文件；
    useHash: false //配置isMod的js不md5
});

fis.match('lib/**.js', {
    isJsLike: true,
    isMod: false,
    optimizer: fis.plugin('uglify-js'),
    useHash: true
});

fis.hook('cmd', {
    //baseUrl: '.',
    //paths: {}
    //forwardDeclaration: true
    //baseUrl: '/javascripts'//配置模块查找的根目录；
});

fis.match('::packager', {
    postpackager: fis.plugin('loader', {
        //resourceType: 'cmd',
        //allInOne: true, // 把每个html里面的css和js合并成一个文件，可以配置产出路径；
        //sourceMap: true, //是否生成依赖map文件
        //useInlineMap: true //是否将sourcemap作为内嵌脚本输出
    })
});

//::image 图片待处理；

fis.match('::package', {
    spriter: fis.plugin('csssprites')
});
fis.match('*.css', {
    useSprite: true
});


fis.match('*.{scss,css,html:css}', {
    optimizer: fis.plugin('clean-css')
});
//fis.match('*.{js,html:js}', {
//    optimizer: fis.plugin('uglify-js')
//});
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});

fis.match('*.{scss,css}', {
    useHash: true
});

/**
 * development environment   名称为dev自动被release执行
 */

fis.media('development').match('*.{js,scss,css}', {
    useHash: false,
    optimizer: null
}).match('*.{scss,css}', {
    useSprite: false
});

/**
 * production environment
 * domain url解决上线CDN和路径问题；
 */
fis.media('prod').match('*.{js,scss}', {
    url: '/test/new_project$0'
});