import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 富文本
import VueQuillEditor from 'vue-quill-editor'

// 导入nprogress
import NProgress from 'nprogress'

// 设置url
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/private/v1/'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 设置NProgress
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config!!!
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 挂载
Vue.prototype.$http = axios

// 注册TreeTable
Vue.component('tree-table', TreeTable)

// 全局过滤器
Vue.filter('dateFormat', function (val) {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDay() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const minute = (date.getMinutes() + '').padStart(2, '0')
  const second = (date.getSeconds() + '').padStart(2, '0')
  return `${year}年${month}月${day}日${hour}:${minute}:${second}`
})

// 注册富文本
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
