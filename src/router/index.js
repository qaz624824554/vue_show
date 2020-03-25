import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/login.vue')
// import Login from '../components/login.vue'
const Home = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/home.vue')
// import Home from '../components/home.vue'
const Welcome = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/welcome.vue')
// import Welcome from '../components/welcome.vue'
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/users.vue')
// import Users from '../components/user/users.vue'
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/rights.vue')
// import Rights from '../components/power/rights.vue'
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/roles.vue')
// import Roles from '../components/power/roles.vue'
const Cate = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/cate.vue')
// import Cate from '../components/goods/cate.vue'
const Params = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/params.vue')
// import Params from '../components/goods/params.vue'
const List = () => import(/* webpackChunkName: "Cate-Params-List" */ '../components/goods/list.vue')
// import List from '../components/goods/list.vue'
const Add = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/goods/add.vue')
// import Add from '../components/goods/add.vue'
const Order = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/order/orders.vue')
// import Order from '../components/order/orders.vue'
const Report = () => import(/* webpackChunkName: "Add-Order-Report" */ '../components/report/report.vue')
// import Report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断用户是否有token，有就给进去home页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
