<template>
  <div class="col-12 flex flex-column">
    <div class="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 mt-4">
      <div class="p-3">
        <label
          class="text-white"
          for="search">Search</label>
        <input
          v-model="searchLocation"
          type="text"
          class="form-control text-white"
          aria-describedby="search"
          placeholder="New York City"
          @keyup.enter.prevent="onSearch">
        <div class="d-flex flex mt-1">
          <select
            v-if="getLocationsSearched.length > 0"
            v-model="selectedPreviousSearch"
            class="custom-select"
            @change="searchPreviousLocation">
            <option>Select a previous search</option>
            <option
              v-for="(search, index) in getLocationsSearched"
              :key="index"
              :value="search">{{ search }}</option>
          </select>
          <button
            :class="getLocationsSearched.length > 0 ? 'mx-1' : 'ml-auto'"
            class="btn btn-outline-info text-white mx-1"
            @click.prevent="findLatLong">Find Me</button>
          <button
            type="submit"
            class="btn btn-outline-primary text-white"
            @click.prevent="onSearch">Search</button>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      appear>
      <div
        v-if="getSearchResults.length > 0"
        class="mt-4 text-white">
        <h2 class="text-nowrap text-center">Showing bars in {{ getLocation.pretty }}</h2>
        <bar
          v-for="(bar, index) in getSearchResults"
          :bardata="getSearchResults[index]"
          :key="bar.id"
          :data-index="index"/>
      </div>
    </transition>
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
      searchLocation: '',
      selectedPreviousSearch: 'Select a previous search'
    }
  },
  computed: {
    ...mapGetters([
      'getLocation',
      'getSearchResults',
      'getLocationsSearched'
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
      console.log(this.searchLocation)
      this.findBars({ location: this.searchLocation })
      this.searchLocation = ''
      this.selectedPreviousSearch = 'Select a previous search'
    },
    searchPreviousLocation () {
      if (this.selectedPreviousSearch === 'Select a previous search') {
        return
      }
      this.searchLocation = this.selectedPreviousSearch
      this.onSearch()
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
.custom-select {
  background-color: transparent;
  color: white;
  border-color: turquoise;
  cursor: pointer;
}
</style>
