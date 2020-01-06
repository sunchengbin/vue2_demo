# 基于微信的H5架构

## 开发环境

- [vue-cli3](https://cli.vuejs.org/zh/)
- yarn

## online代码nginx配置记录

```
  server {
    listen 80;
    server_name kg.stage.ktvsky.com;
    root /home/work/online/src/wx_ktv/dist/;
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
```

## 需要注意的问题

因为vue-cli3做了改进，使用了一套基于插件的架构。

所以需要修改webpack配置和环境变量切换等方面需要学习新写法。

**想要查看cli-service抽象过的webpack配置，需要执行vue inspect > output.js。查看output.js即可**

## 搭建框架过程说明

#### 移动端适配方案

[参见] (https://mp.weixin.qq.com/s/Ey9SbQcacfW7celMSWyBRg)

#### 全局引入base.scss
首先安装style-resources-loader的npm包，然后在vue.config.js中添加如下代码
```
const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
// 这里的types的选项，可以通过执行vue inspect > output.js，导出output.js，然后在output.js中查看
types.forEach(type => {
  config.module.rule('scss').oneOf(type).use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/css/base.scss')
      ]
    })
})
```
#### 添加svg组件

首先安装svg-sprite-loader的npm包并创建svg组件，然后修改vue.config.js，配置对应的loader（svg-sprite-loader）。

```
const svgRule = config.module.rule('svg')
svgRule.uses.clear()
svgRule
  .use('svg-sprite-loader')
  .loader('svg-sprite-loader')
  .tap(options => {
    options = {
      symbolId: 'icon-[name]'
    }
    return options
  })
```
#### 项目构建后的静态文件publicPath的配置
修改vue.config.js，添加顶级属性baseUrl

```
baseUrl: process.env.NODE_ENV !== 'development' ? '/vue_demo/dist/' : './'
```

#### HOST各环境兼容方案 (https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)
> 根据不同生产环境配置不同的接口域名，通过修改或者添加根目录下.env.[环境变量](例如: .env.stage)文件中的对应参数

#### 接口集合(src/libs)
> 主要是把常用的：封装过的http接口、接口路径、常用的函数等进行拆分

#### 动态加载路由
> 首先按照规则在 src/routers 文件夹中添加不同功能模块相关的路由文件,js按照commonjs格式编写,目的是路由文件模块化，方便维护和管理

例如: routers/index.js

```
module.exports = [
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/about.vue')
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/views/help.vue')
  }
]

```

src/router.js 中添加动态路由加载 [webpack上下文](https://webpack.docschina.org/guides/dependency-management/#require-context)

```
// 动态加载路由
function importAll (r) {
  r.keys().forEach(fileName => {
    if (/.\//.test(fileName)) {
      fileName = fileName.replace('./', '')
    }
    const file = require(`./routers/${fileName}`)
    routes = routes.concat(file)
  })
}
importAll(require.context('@/routers', true, /.js$/))

```

#### 关闭prefetch (https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch)

> 默认情况下所有import()的产物自动生成prefetch，这种链接消耗带宽，所以需要手动关闭，然后手动选择需要prefetch的链接。

vue.config.js 中添加如下代码

```

module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
  }
}

```
#### 公共模块的提取(dll-plugin)

一、安装npm包webpack, webpack-cli, add-asset-html-webpack-plugin

二、创建webpack.dll.config.js

三、package.json中添加构建执行命令

```
  "prod_dll": "NODE_ENV=production webpack --config webpack.dll.config.js --progress",
  "dev_dll": "NODE_ENV=development webpack --config webpack.dll.config.js --progress"
```

四、修改vue.config.js,添加plugin

```

// chainWebpack中添加如下代码
chainWebpack: config => {
  const chunkFolder = process.env.NODE_ENV !== 'production' ? 'debug' : 'dist'
  config.plugin('dll-reference-plugin')
    .use(webpack.DllReferencePlugin)
    .tap(options => {
      options[0] = {
        context: __dirname,
        manifest: require(path.join(__dirname, `./src/common_chunk/${chunkFolder}/manifest.json`))
      }
      return options
    })
  config.plugin('add-asset-html-webpack-plugin')
    .use('add-asset-html-webpack-plugin')
    .tap(options => {
      options[0] = {
        filepath: path.resolve(__dirname, `./src/common_chunk/${chunkFolder}/lib_*.js`)
      }
      return options
    })
}

```

## 项目目录

```
├── src
    ├── components                组件
        ├── common                  基础组件
            ├──svg_icon             svg组件
            ├──lazy_load            懒加载
            ├──loading              loading
            ├──message_box          消息box
            ├──toast                toast提醒
            ├──infinite_scroll      滚动指令
        ├── app                   项目相关的组件
    ├── minxins                   混合模式
    ├── views                     页面
    ├── assets                    静态资源
    ├── views                     页面
    └── libs                      函数库集合
        ├── app                   项目中操作库函数
            └── weixin            微信api相关
        ├── base                  基础函数聚合
            ├── http              http请求封装, 基于axios
            └── apis              接口请求url聚合
        ├── interfaces            调用聚合、方便引用
        └── utils                 工具函数封装
            └── index             常用函数聚合
    ├── imgs                      图片集合
    └── css                       样式集合
├── .env.development              开发环境全局变量管理文件
├── .env.stage                    预上线环境全局变量管理文件
├── .env.production               生产环境全局变量管理文件
├── .eslintrc.js                  eslint相关配置
├── babel.config.js               babel相关配置
└── vue.config.js                 vue-cli3创建的项目，需要通过该文件进行webpack配置编辑
```