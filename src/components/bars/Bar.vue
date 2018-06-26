<template>
  <div class="col-10 mx-auto mt-4 text-white d-flex">
    <div>
      <img
        :src="bardata.image_url"
        :alt="bardata.alias"
        class="image border border-white rounded mt-2">
    </div>
    <div class="ml-4 mt-4">
      <h3>{{ bardata.name }}</h3>
      <p>Distance Away: {{ distanceInMiles }} miles</p>
      <p>Phone: {{ bardata.display_phone }}</p>
      <p>Address: {{ bardata.location.display_address[0] }}</p>
      <p>{{ bardata.location.display_address[bardata.location.display_address.length - 1] }}</p>
    </div>
    <div class="ml-4 mt-4">
      <div>
        <img
          :src="getRatingPng"
          alt="rating"><p>Rating: {{ bardata.rating }}</p>
      </div>
      <p>yelp logo link</p>
      <p>See who is here</p>
      <p>Be Here</p>
      <p>Share on twitter</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bardata: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    distanceInMiles () {
      return (this.bardata.distance * 0.000621371).toFixed(2)
    },
    getRatingPng () {
      switch (this.bardata.rating) {
        case 5:
          return '/static/yelp_stars/web_and_ios/regular/regular_5.png'
        case 4.5:
          return '/static/yelp_stars/web_and_ios/regular/regular_4_half.png'
        case 4:
          return '/static/yelp_stars/web_and_ios/regular/regular_4.png'
        default:
          return '/static/yelp_stars/web_and_ios/regular/regular_0.png'
      }
    }
  }
}
</script>

<style>
.image {
  width: 225px;
  height: 225px;
}
</style>
