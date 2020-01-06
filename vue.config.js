// 配置api地址：https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE
const path = require('path')
const webpack = require('webpack')
const Timestamp = new Date().getTime()
module.exports = {
  // 修改output.path
  outputDir: 'dist',
  // 修改output.publishPath
  baseUrl: process.env.BASE_URL,
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `[name].${Timestamp}.js`,
      chunkFilename: `[name].${Timestamp}.js`
    }
  },
  chainWebpack: config => {
    // 添加全局scss文件
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => {
      config.module.rule('scss').oneOf(type).use('style-resource')
        .loader('style-resources-loader')
        .options({
          patterns: [
            path.resolve(__dirname, 'src/css/base.scss')
          ]
        })
    })
    // 添加svg-sprite-loader
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
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 引入基础包，把必需和不会改变的包提前编译
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
    // 引入移动端调试工具
    config.plugin('vconsole-webpack-plugin')
      .use('vconsole-webpack-plugin')
      .tap(options => {
        options[0] = {
          enable: process.env.NODE_ENV === 'stage'
        }
        return options
      })
  }
}
