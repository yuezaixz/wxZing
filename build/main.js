require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_nuxt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_path__);






// Import and Set Nuxt.js options
const config = __webpack_require__(8);
config.dev = !(__WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].env === 'production');

const r = path => Object(__WEBPACK_IMPORTED_MODULE_4_path__["resolve"])(__dirname, path);
const MIDDLEWARES = ['database', 'common', 'router'];

class Server {
  constructor() {
    this.app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
    this.useMiddlewares(this.app)(MIDDLEWARES);
  }
  useMiddlewares(app) {
    // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数
    // R.map(console.log)([1, 2, 3])
    // MIDDLEWARE 数组交给了 R.map
    // 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
    return __WEBPACK_IMPORTED_MODULE_3_ramda___default.a.map(__WEBPACK_IMPORTED_MODULE_3_ramda___default.a.compose(__WEBPACK_IMPORTED_MODULE_3_ramda___default.a.map(i => i(app)), !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), i => `${r('./middleware')}/${i}`));
  }

  async start() {
    // Instantiate nuxt.js
    const nuxt = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Nuxt"](config);
    // Build in development
    if (config.dev) {
      const builder = new __WEBPACK_IMPORTED_MODULE_2_nuxt__["Builder"](nuxt);
      await builder.build();
    }
    this.app.use(async (ctx, next) => {
      await next();
      ctx.req.session = ctx.session;
      // console.log('ctx.req.session', ctx.session)
      ctx.status = 200; // koa defaults to 404 when it sees that status is unset
      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve);
        ctx.res.on('finish', resolve);
        nuxt.render(ctx.req, ctx.res, promise => {
          // nuxt.render passes a rejected promise into callback on error.
          promise.then(resolve).catch(reject);
        });
      });
    });
    this.app.listen(__WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].port, __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].host);
    console.log('Server listening on ' + __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].host + ':' + __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */].port); // eslint-disable-line no-console
  }
}

const app = new Server();
app.start();
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "server"))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);



const host = process.env.HOST || 'localhost';
const env = "production" || 'development';
const conf = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.assign({
  env,
  host
}, conf));

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 5;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("nuxt");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("ramda");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

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
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0'
    }, {
      hid: 'description',
      name: 'description',
      content: 'TODO一个相亲项目'
    }],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico'
    }],
    script: [{
      src: 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js'
    }]
  },
  /*
   ** Global CSS
   */
  css: [{
    src: 'static/sass/base.sass',
    lang: 'sass?indentedSyntax=true'
  }, {
    src: 'swiper/dist/css/swiper.css'
  }, {
    src: 'static/css/weui.min.css'
  }],
  /*
   ** Customize the progress-bar color
   */
  plugins: [{ src: '~plugins/swiper.js', ssr: false }, { src: '~plugins/flexible.js', ssr: false }, { src: '~plugins/eleui.js', ssr: false }],
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
    loaders: [{
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'img/[name].[hash].[ext]'
      }
    }]
  },
  performance: {
    prefetch: false
  }
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 9;

/***/ })
/******/ ]);
//# sourceMappingURL=main.map