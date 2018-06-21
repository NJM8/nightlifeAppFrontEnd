<template>
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
      <button
        type="submit"
        class="btn btn-outline-primary text-white float-right m-1">Search</button>
      <button
        class="btn btn-outline-info text-white float-right m-1"
        @click.prevent="findLatLong">Find Me</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      searchLocation: ''
    }
  },
  methods: {
    ...mapActions([
      'findBars'
    ]),
    findLatLong () {
      this.$getLocation()
        .then(coordinates => {
          console.log(coordinates)
        })
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
</style>
