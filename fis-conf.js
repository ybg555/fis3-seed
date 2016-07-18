/**
 * @author Blade
 * @date 2016/07/13
 */

/*========== global config ==========*/
var root = fis.project.getProjectPath();
console.info("root=>", root);
// 只需要编译 html 文件，以及其用到的资源
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
    '.gitignore',
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
console.log('css=>',fis.get('PC.res.css'));

/*========== relative path ==========*/
//fis.hook('relative');
//fis.match('**', {
//    relative: true
//});

/*========== ignore sfc ==========*/
//fis.match("_*.{css,less,scss}", {
//    release: false
//}, true);

fis.match('tpl/(*.html)', {
    //release: '/template/$1'
    isHtmlLike: true,
    parser: fis.plugin('html-ejs', {}),
    optimizer: fis.plugin('html-minifier')
});

fis.match('*.scss', {
    isCssLike: true,
    rExt: '.css',
    parser: fis.plugin('node-sass', {
        include_paths: ['web/public/stylesheets/_compass'] // 兼容 compass
    })
});

/**
 * js模块化构建流程
 * 1.指定模块化作用域(全部define都会补全)
 * 2.模块化补全和封装，别名配置等；（补全的路径问题是绝对值，依赖的路径是非hash的路径）
 * 3.过程中文件载入插件（生成静态资源表，完成按依赖打包，cmd只能根据html当前页全打包）
 */
fis.match('/(**).js', {
    id: '$1',  //文件产出路径，use,define的路径;生产环境改
    //moduleId: 'test2/$1', //define时自定义路径,默认用的id,所以用id可以了
    isJsLike: true,
    isMod: true,
    optimizer: fis.plugin('uglify-js'),
    //useHash: false //配置isMod的js不md5,拿到当前编译的hash后缀可以开启这个拼接,_uri()可解决；
});

fis.match('lib/**.js', {
    isJsLike: true,
    isMod: false,
    useHash: true
});

fis.hook('cmd');

fis.match('::packager', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            includeAsyncs: true,
            js: function (file) {
                return "/web/public/javascripts/" + file.filename + "_aio.js";
            },
            css: function (file) {
                return "/web/public/stylesheets/" + file.filename + "_aio.css";
            }
        }
    })
});

/**
 * 雪碧图
 * url: https://www.npmjs.com/package/fis-spriter-csssprites-group
 * param: ?__sprite=group	标识图片合并到"group_(x|y|z).png" group只支持“字母、数字、-、_”
 * 打包出的路径不是hash后的路径；
 */
fis.match('::package', {
    spriter: fis.plugin('csssprites-group', {
        margin: 10,
        to: './image' //相对.scss文件的路径；
    })
});
fis.match('*.{css,scss}', {
    useSprite: true,
});


fis.match('*.{scss,css,html:css}', {
    optimizer: fis.plugin('clean-css')
});
fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});


fis.match('*.{scss,css,::image}', {
    useHash: true
});


/**
 * development environment   名称为dev自动被release执行
 */
fis.media('development').match('*.{js,scss,css,::image}', {
    useHash: false,
    optimizer: null
}).match('tpl/(*.html)', {
    optimizer: null
});

/**
 * production environment
 * domain url解决上线CDN和路径问题；
 * 产出加多一层product，本地mock服务器路径；
 */
fis.media('prod').match('*.{js,css,::image}', {
    url: '/product$0' //修改产出路径
}).match('/(**).js', {
    id: 'product/$1', //修改id
});