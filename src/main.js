import Vue from 'vue'
import router from './router';
import store from "@/store";
import App from './App.vue'
import global from './store/global';
import 'static/style/normalize.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'amfe-flexible'
import 'animate.css'
import 'static/style/element.less'
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);

import './assets/font/font.css'

//图片引入的浏览器插件
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

//引入图片浏览插件
Vue.use(VueViewer);
//引入图片浏览插件
VueViewer.setDefaults({
    "inline": false,
    "button": true,
    "navbar": true,
    "title": true,
    "toolbar": true,
    "tooltip": true,
    "movable": true,
    "zoomable": true,
    "rotatable": true,
    "scalable": true,
    "transition": false,
    "fullscreen": true,
    "keyboard": false,
});

Vue.prototype.Global = global;
Vue.config.productionTip = false
NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();
  document.title = to.meta.title
  next();
})

router.afterEach(() => {
  NProgress.done();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
