<template>
  <nav class="sidebar text-center text-white border-right border-white p-1">
    <h2>Bar Meetup</h2>
    <div
      class="sidebar-sticky">
      <ul class="nav d-flex flex-column h-100">
        <router-link
          to="/home"
          tag="li"
          active-class="active"
          exact
          class="nav-item">
          <a class="nav-link">Home</a>
        </router-link>
        <router-link
          v-show="!getIsAuth"
          to="/signup"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">Sign Up</a>
        </router-link>
        <router-link
          v-show="!getIsAuth"
          to="/login"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">Log In</a>
        </router-link>
        <li
          v-show="getIsAuth"
          class="nav-item">
          <a
            class="nav-link"
            @click.prevent="logout">Log Out</a>
        </li>
        <a
          class="nav-link mt-auto mb-2 portfolioLink"
          href="https://www.natethedev.com/"
          target="_blank"
          rel="noopener">Created by Nate Mallison</a>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'getIsAuth',
      'getUserName'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}
.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}
.nav-link {
  cursor: pointer;
}
.portfolioLink {
  font-size: 1.1rem;
  font-weight: bold;
  font-style: italic;
}
.active {
  font-weight: bold;
}
a {
  color: white !important;
}
.active > a {
  color: #5BC0DE !important;
}
</style>
