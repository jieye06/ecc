// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import IView from 'iview'
import App from './App'
import router from './router'
import common from './JS/common.js'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false
Vue.use(IView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
