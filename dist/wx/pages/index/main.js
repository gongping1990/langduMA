require("../../common/manifest.js")
require("../../common/vendor.js")
global.webpackJsonpMpvue([6],{

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(21);



// add this to handle exception
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err);
  }
};

var app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */]);
app.$mount();

/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_1932e983_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_fileExt_template_wxml_script_js_style_wxss_platform_wx_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(24);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(22)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1932e983"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_1932e983_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_fileExt_template_wxml_script_js_style_wxss_platform_wx_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/index/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1932e983", Component.options)
  } else {
    hotAPI.reload("data-v-1932e983", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 22:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      swiperIndex: 0,
      classIndex: 0,
      newsList: ['跟着老师一起朗读了《天地人》，获得新成就', '跟着老师一起朗读了《天', '了《天地人》，获得新成就'],
      bannerList: ['https://pub.file.k12.vip/2019/03/04/1102390948861579266.png', 'https://pub.file.k12.vip/2018/11/17/d1615b9fa20ee58a38b87a6ed02b96b.png', "https://pub.file.k12.vip/2019/03/04/1102391104851939329.png"]
    };
  },


  methods: {
    swiperChange: function swiperChange(e) {
      this.swiperIndex = e.mp.detail.current;
    },
    changeClassIndex: function changeClassIndex(e) {
      this.classIndex = e.mp.detail.current;
    },
    tapClassItem: function tapClassItem(index) {
      this.classIndex = index;
    }
  },

  created: function created() {
    // let app = getApp()
  }
});

/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home"
  }, [_c('div', {
    staticClass: "home-banner"
  }, [_c('swiper', {
    staticClass: "swiper-block",
    attrs: {
      "previous-margin": "48rpx",
      "next-margin": "48rpx",
      "current": "0",
      "circular": true,
      "eventid": '0'
    },
    on: {
      "change": _vm.swiperChange
    }
  }, _vm._l((_vm.bannerList), function(item, index) {
    return _c('block', {
      key: item
    }, [_c('swiper-item', {
      staticClass: "swiper-item",
      attrs: {
        "mpcomid": '0_' + index
      }
    }, [_c('image', {
      staticClass: "slide-image",
      class: _vm.swiperIndex == index ? 'active' : '',
      attrs: {
        "mode": "widthFix",
        "src": item
      }
    })])], 1)
  })), _vm._v(" "), _c('div', {
    staticClass: "news"
  }, [_c('div', {
    staticClass: "news-image"
  }), _vm._v(" "), _c('swiper', {
    staticClass: "news-swiper",
    attrs: {
      "current": "0",
      "circular": "",
      "vertical": "",
      "autoplay": ""
    }
  }, _vm._l((_vm.newsList), function(item, index) {
    return _c('block', {
      key: item
    }, [_c('swiper-item', {
      staticClass: "news-swiper-item",
      attrs: {
        "mpcomid": '1_' + index
      }
    }, [_c('text', {
      staticClass: "news-text"
    }, [_vm._v(_vm._s(item))])])], 1)
  }))], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "class-list"
  }, [_c('swiper', {
    staticClass: "class-list_swiper",
    attrs: {
      "previous-margin": "280rpx",
      "next-margin": "280rpx",
      "current": _vm.classIndex,
      "eventid": '2'
    },
    on: {
      "change": _vm.changeClassIndex
    }
  }, _vm._l((10), function(item, index) {
    return _c('block', {
      key: item
    }, [_c('swiper-item', {
      staticClass: "class-list_swiper__item",
      attrs: {
        "mpcomid": '2_' + index
      }
    }, [_c('div', {
      staticClass: "class-list_item",
      class: _vm.classIndex == index ? 'active' : '',
      attrs: {
        "eventid": '1_' + index
      },
      on: {
        "tap": function($event) {
          _vm.tapClassItem(index)
        }
      }
    }, [_c('text', {
      staticClass: "class-name"
    }, [_vm._v("四年级")]), _vm._v(" "), _c('text', {
      staticClass: "class-text"
    }, [_vm._v("下册")])])])], 1)
  }))], 1), _vm._v(" "), _vm._m(0)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home-good_list"
  }, [_c('div', {
    staticClass: "home-good_item"
  }, [_c('div', {
    staticClass: "home-good_left"
  }, [_c('text', {
    staticClass: "home-good_title"
  }, [_vm._v("《天地人》")]), _vm._v(" "), _c('text', {
    staticClass: "home-good_text"
  }, [_vm._v("朗读老师：李林")]), _vm._v(" "), _c('div', {
    staticClass: "home-good_num"
  }, [_vm._v("2368 位同学已会读")])]), _vm._v(" "), _c('div', {
    staticClass: "home-good_right"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1932e983", esExports)
  }
}

/***/ })

},[20]);