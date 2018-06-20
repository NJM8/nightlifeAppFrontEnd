import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'

import Home from '../components/main/Home.vue'
import Bars from '../components/bars/Bars.vue'
import LogIn from '../components/auth/LogIn.vue'
import SignUp from '../components/auth/SignUp.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/home',
    component: Home,
    meta: '0'},
  { path: '/bars',
    component: Bars,
    meta: '1'},
  { path: '/signup',
    component: SignUp,
    meta: '2',
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/login',
    component: LogIn,
    meta: '3',
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/*', redirect: '/home' }
]

export default new VueRouter({mode: 'history', routes})
