<template>
  <div
    id="app"
    :class="getSearchResults.length > 0 ? '' : 'preventYScroll'"
    class="container-fluid d-flex flex-column">
    <div class="row">
      <app-sidebar/>
    </div>
    <app-message/>
    <div class="row marginLeft">
      <transition
        :name="transitionName"
        mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import SideBar from './components/main/SideBar'
import Message from './components/main/Message'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    'app-sidebar': SideBar,
    'app-message': Message
  },
  data () {
    return {
      transitionName: ''

    }
  },
  computed: {
    ...mapGetters([
      'getSearchResults'
    ])
  },
  watch: {
    '$route' (to, from) {
      const toName = Number(to.meta)
      const fromName = Number(from.meta)
      this.transitionName = toName > fromName ? 'slide-right' : 'slide-left'
    }
  },
  created () {
    this.tryAutoLogin()
  },
  methods: {
    ...mapActions([
      'tryAutoLogin'
    ])
  }
}
</script>

<style>
.slide-right-enter {
  transform: translateY(400px);
  opacity: 0;
}
.slide-right-enter-active {
  transition: all 300ms ease;
}
.slide-right-leave-active {
  transition: all 300ms ease;
  transform: translateY(-400px);
  opacity: 0;
}
.slide-left-enter {
  transform: translateY(-400px);
  opacity: 0;
}
.slide-left-enter-active {
  transition: all 300ms ease;
}
.slide-left-leave-active {
  transition: all 300ms ease;
  transform: translateY(400px);
  opacity: 0;
}
.marginLeft {
  margin-left: 200px;
}
.preventYScroll {
  overflow-y: hidden;
}
#app {
  height: 100vh;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
