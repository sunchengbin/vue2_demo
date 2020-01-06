const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isDebug = process.env.NODE_ENV === 'development'
const outputPath = isDebug ? path.join(__dirname, './src/common_chunk/debug') : path.join(__dirname, './src/common_chunk/dist')
const fileName = '[name]_[hash].js'
const CleanWebpackPlugin = require('clean-webpack-plugin')

// 资源依赖包，提前编译
const lib = [
  'vue',
  'vuex',
  'vue-router',
  'axios',
  'weixin-js-sdk'
]

const plugin = [
  new CleanWebpackPlugin([outputPath]),
  new webpack.DllPlugin({
    /**
     * path
     * 定义 manifest 文件生成的位置
     * [name]的部分由entry的名字替换
     */
    path: path.join(outputPath, 'manifest.json'),
    /**
     * name
     * dll bundle 输出到那个全局变量上
     * 和 output.library 一样即可。
     */
    name: '[name]_[hash]',
    context: __dirname
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
]

if (!isDebug) {
  plugin.push(
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify('production')
    // }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: true
    })
  )
}

module.exports = {
  mode: !isDebug ? 'production' : 'development',
  devtool: '#source-map',
  entry: {
    lib: lib
  },
  output: {
    path: outputPath,
    filename: fileName,
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]_[hash]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: plugin
}
