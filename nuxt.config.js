/* eslint-disable */
module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'Office Plan',
    meta: [{
        // 禁止下一行的各种警告
        // eslint-disable-next-line
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0'
      },
      
      {
        hid: 'description',
        name: 'description',
        content: 'TODO一个相亲项目'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico'
    }],
    script: [{
      src: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'
    }]
  },
  /*
   ** Global CSS
   */
  css: [
    {
      src: 'static/sass/base.sass',
      lang: 'sass?indentedSyntax=true'
    },
    {
      src: 'swiper/dist/css/swiper.css'
    }
  ],
  /*
   ** Customize the progress-bar color
   */
  plugins: [
    { src: '~plugins/swiper.js', ssr: false },
    { src: '~plugins/flexible.js', ssr: false }
  ],
  loading: {
    color: '#3B8070'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    // extend(config, ctx) {
    //   if (ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // },
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash].[ext]'
        }
      }
    ]
  },
  performance: {
    prefetch: false
  }
}
