module.exports = {
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'element-ui': 'ELEMENT'
  // },
  webpack: (config, options, webpack) => {
    config.entry.main = './server/index.js'
    return config
  }
}
