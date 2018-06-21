import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    username: null,
    invalidCredentials: false,
    takenCredentials: false,
    returningUser: false,
    userMessage: null,
    searchResults: [],
    location: {
      lat: null,
      long: null,
      pretty: null
    }
  },
  mutations: {
    setAuthUser (state, userData) {
      state.idToken = userData.idToken
      state.username = userData.username
    },
    setStoreUser (state, userData) {
      state.username = userData.username
    },
    setClearAuthData (state) {
      state.idToken = null
      state.username = null
      state.returningUser = false
    },
    setInvalidCredentials (state, payload) {
      state.invalidCredentials = payload
    },
    setTakenCredentials (state, payload) {
      state.takenCredentials = payload
    },
    setReturningUser (state, payload) {
      state.returningUser = payload
    },
    setMessage (state, payload) {
      state.userMessage = payload
    },
    setSearchResults (state, payload) {
      state.searchResults = payload
    },
    setLatLong (state, payload) {
      state.location.lat = payload.lat
      state.location.long = payload.long
    },
    setPrettyLocation (state, payload) {
      state.location.pretty = payload
    }
  },
  actions: {
    signUp ({commit, dispatch}, authData) {
      axios.post('/auth/signup', {
        email: authData.email,
        password: authData.password,
        username: authData.username
      })
        .then(res => {
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: authData.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('setTakenCredentials', error.response.data)
            return
          }
          console.log(error)
        })
    },
    logIn ({commit, dispatch}, authData) {
      axios.post('/auth/login', {
        username: authData.username,
        password: authData.password
      })
        .then(res => {
          commit('setInvalidCredentials', false)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: authData.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('setInvalidCredentials', error.response.data)
            return
          }
          console.log(error)
        })
    },
    tryAutoLogin ({commit, dispatch}) {
      const savedData = JSON.parse(localStorage.getItem('nightlifeAppUserData'))
      if (!savedData) {
        return
      }
      const expirationDate = savedData.expirationDate
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      commit('setAuthUser', {
        idToken: savedData.idToken,
        username: null
      })
      dispatch('fetchUser')
    },
    logout ({commit, dispatch}) {
      commit('setClearAuthData')
      dispatch('setUserMessage', 'Logged out')
      localStorage.removeItem('nightlifeAppUserData')
      router.replace('/home')
    },
    fetchUser ({commit, dispatch, state}) {
      if (!state.idToken) {
        return
      }
      axios.post('/auth/verifyUser', { idToken: state.idToken })
        .then(res => {
          commit('setStoreUser', res.data.username)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: res.data.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.data.err === 'login') {
            dispatch('setUserMessage', error.response.data.message)
            commit('setReturningUser', true)
            router.push('/login')
            return
          }
          if (error.response.data.err === 'Invalid Token') {
            dispatch('setUserMessage', error.response.data.message)
            dispatch('logout')
            return
          }
          console.log(error)
        })
    },
    storeDataToLocalStorage ({commit}, payload) {
      const now = new Date()
      const expirationDate = new Date(now.getTime() + payload.expiresIn * 1000)
      localStorage.setItem('nightlifeAppUserData', JSON.stringify({
        'idToken': payload.idToken,
        'expirationDate': expirationDate
      }))
    },
    setUserMessage ({commit}, payload) {
      commit('setMessage', payload)
    },
    findBars ({commit}, payload) {
      commit('setLatLong', payload)
      // axios code to get pretty location and bars
    }
  },
  getters: {
    getUserName (state) {
      return state.username
    },
    getIsAuth (state) {
      return state.idToken !== null && state.username !== null
    },
    getReturningUser (state) {
      return state.returningUser
    },
    getInvalidCredentials (state) {
      return state.invalidCredentials
    },
    getTakenCredentials (state) {
      return state.takenCredentials
    },
    getMessage (state) {
      return state.userMessage
    },
    getSearchResults (state) {
      return state.searchResults
    },
    getLocation (state) {
      return state.location
    }
  }
})
