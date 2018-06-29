// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from 'axios'
import VeeValidate from 'vee-validate'
import VueGeolocation from 'vue-browser-geolocation'

Vue.config.productionTip = false
Vue.use(VeeValidate, {
  events: 'blur'
})
Vue.use(VueGeolocation)

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://natethedev-nightlifeappbackend.herokuapp.com/'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
