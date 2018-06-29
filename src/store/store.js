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
      lng: null,
      pretty: null
    },
    userLocation: null,
    locationsSearched: []
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
    setLatLng (state, payload) {
      state.location.lat = payload.lat
      state.location.lng = payload.lng
    },
    setPrettyLocation (state, payload) {
      state.location.pretty = payload
    },
    setUserCheckIn (state, payload) {
      if (state.userLocation) {
        state.searchResults.forEach(location => {
          if (location.id === state.userLocation) {
            const index = location.peopleHere.indexOf(state.username)
            location.peopleHere.splice(index, 1)
          }
        })
      }
      state.searchResults.forEach(location => {
        if (location.id === payload) {
          location.peopleHere.push(state.username)
        }
      })
    },
    setUserLocation (state, payload) {
      state.userLocation = payload
    },
    setLocationsSearched (state, payload) {
      state.locationsSearched = payload
    },
    addToLocationsSearched (state, payload) {
      state.locationsSearched.push(payload)
    }
  },
  actions: {
    signUp ({commit, dispatch}, authData) {
      axios.post('/signup', {
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
    logIn ({commit, dispatch, state}, authData) {
      axios.post('/login', {
        username: authData.username,
        password: authData.password
      })
        .then(res => {
          commit('setInvalidCredentials', false)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: authData.username
          })
          commit('setLocationsSearched', res.data.locationsSearched)
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          commit('setUserLocation', res.data.currentLocation)
          if (state.searchResults) {
            state.searchResults.forEach(bar => {
              if (bar.peopleHere.includes(state.username)) {
                commit('setUserLocation', bar.id)
              }
            })
          }
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
      commit('setLocationsSearched', [])
      commit('setUserLocation', '')
      dispatch('setUserMessage', 'Logged out')
      localStorage.removeItem('nightlifeAppUserData')
      router.replace('/home')
    },
    fetchUser ({commit, dispatch, state}) {
      if (!state.idToken) {
        return
      }
      axios.post('/verifyUser', { idToken: state.idToken })
        .then(res => {
          commit('setStoreUser', res.data.username)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: res.data.username
          })
          commit('setLocationsSearched', res.data.locationsSearched)
          commit('setUserLocation', res.data.currentLocation)
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
    findBars ({commit, dispatch, state}, payload) {
      if (state.searchResults) {
        commit('setSearchResults', [])
        commit('setPrettyLocation', '')
      }
      dispatch('setUserMessage', 'Finding bars')
      commit('setLatLng', payload)
      axios.post('/findBars', {
        idToken: state.idToken,
        location: payload.location || '',
        latitude: payload.lat || '',
        longitude: payload.lng || ''
      })
        .then(res => {
          res.data.forEach(bar => {
            if (bar.peopleHere.includes(state.username)) {
              commit('setUserCheckIn', bar.id)
              commit('setUserLocation', bar.id)
            }
          })
          commit('setSearchResults', res.data.sort((a, b) => a.distance > b.distance))
          commit('setPrettyLocation', `${res.data[0].location.city}, ${res.data[0].location.state}, ${res.data[0].location.country}`)
          if (!state.locationsSearched.includes(state.location.pretty) && state.username) {
            commit('addToLocationsSearched', state.location.pretty)
          }
        })
        .catch(error => {
          if (error.response.status === 400) {
            dispatch('setUserMessage', error.response.data)
          }
          console.log(error)
        })
    },
    checkIn ({commit, dispatch, state}, payload) {
      if (state.idToken === null) {
        dispatch('setUserMessage', 'You must log in to check in')
        return
      }
      if (state.userLocation === payload) {
        dispatch('setUserMessage', 'You are already checked in here')
        return
      }
      if (state.userLocation) {
        axios.post('/checkOut', {
          barId: state.userLocation,
          peopleHere: state.username
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      }
      commit('setUserCheckIn', payload)
      commit('setUserLocation', payload)
      const bar = state.searchResults.find(bar => bar.id === payload)
      dispatch('setUserMessage', `You are checked in to ${bar.name}, invite your friends on Twitter!`)
      axios.post('/checkIn', {
        barId: payload,
        peopleHere: state.username
      }).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
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
    },
    getLocationsSearched (state) {
      return state.locationsSearched
    }
  }
})
