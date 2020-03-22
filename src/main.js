import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 设置url
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/private/v1/'
// 设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config!!!
  return config
}, error => {
  return Promise.reject(error)
})
// 挂载
Vue.prototype.$http = axios

// 注册TreeTable
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
