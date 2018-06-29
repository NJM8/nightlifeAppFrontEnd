<template>
  <div class="col-12 flex flex-column">
    <div class="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 mt-4">
      <form
        class="p-3"
        @submit.prevent="onSearch">
        <label
          class="text-white"
          for="search">Search</label>
        <input
          v-model="searchLocation"
          type="text"
          class="form-control text-white"
          aria-describedby="search"
          placeholder="New York City">
        <div class="d-flex flex-row-reverse">
          <button
            type="submit"
            class="btn btn-outline-primary text-white mt-1">Search</button>
          <button
            class="btn btn-outline-info text-white mt-1 mr-1"
            @click.prevent="findLatLong">Find Me</button>
        </div>
      </form>
    </div>
    <div class="mt-4 text-white">
      <h2
        v-if="getLocation.pretty"
        class="text-nowrap text-center">Showing bars in {{ getLocation.pretty }}</h2>
      <transition name="fade">
        <div v-if="getSearchResults.length > 0">
          <bar
            v-for="(bar, index) in getSearchResults"
            :bardata="getSearchResults[index]"
            :key="bar.id"
            :data-index="index"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Bar from './Bar.vue'

export default {
  components: {
    Bar
  },
  data () {
    return {
      searchLocation: ''
    }
  },
  computed: {
    ...mapGetters([
      'getLocation',
      'getSearchResults'
    ])
  },
  methods: {
    ...mapActions([
      'findBars'
    ]),
    findLatLong () {
      this.$getLocation()
        .then(coordinates => {
          this.findBars(coordinates)
        })
    },
    onSearch () {
      this.findBars({ location: this.searchLocation })
      this.searchLocation = ''
    }
  }
}
</script>

<style>
.form-control {
  background-color: transparent;
}
.form-control:focus {
  background-color: transparent;
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: all 1s;
}
.fade-leave-active {
  transition: all 1s;
  opacity: 0;
}
</style>
