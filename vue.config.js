module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  css: {
    extract: false,
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          localIdentName: "[local]__[hash:base64:5]"
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("pug")
      .test(/template\.html$/i)
      .use("pug-loader")
      .loader("pug-loader")
      .end();
  }
};
