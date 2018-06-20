// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from 'axios'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate, {
  events: 'blur'
})

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://natethedev-votingappbackend.herokuapp.com/'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
