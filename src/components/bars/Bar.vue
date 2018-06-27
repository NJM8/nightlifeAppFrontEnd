<template>
  <div class="col-11 mx-auto mt-4 text-white d-flex">
    <div>
      <img
        :src="bardata.image_url"
        :alt="bardata.alias"
        class="image border border-white rounded mt-2">
    </div>
    <div class="ml-4 mt-3 col-4">
      <h3>{{ bardata.name }}</h3>
      <p>Distance Away: {{ distanceInMiles }} miles</p>
      <p>Phone: {{ bardata.display_phone }}</p>
      <p>Address: {{ bardata.location.display_address[0] }}</p>
      <p>{{ bardata.location.display_address[bardata.location.display_address.length - 1] }}</p>
    </div>
    <div class="ml-4 mt-2">
      <div>
        <img
          :src="getRatingPng"
          alt="rating">
        <a :href="bardata.url"><img
          src="/static/YelpLogo_Trademark/Screen(R)/Yelp_trademark_RGB_outline.png"
          alt="Yelp Logo"
          class="yelpLogo"
          target="_blank"
          rel="noopener"></a>
      </div>
      <p>{{ bardata.rating }} stars based on {{ bardata.review_count }} reviews</p>
      <div
        class="btn-group mt-3"
        role="group">
        <button class="btn btn-sm btn-outline-info text-white">See who is here</button>
        <button class="btn btn-sm btn-outline-primary text-white">Be Here</button>
      </div>
      <button
        class="btn btn-sm btn-outline-success text-white mt-2"
        @click="shareOnTwitter">Share on twitter</button>
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
        case 3.5:
          return '/static/yelp_stars/web_and_ios/regular/regular_3_half.png'
        case 3:
          return '/static/yelp_stars/web_and_ios/regular/regular_3.png'
        case 2.5:
          return '/static/yelp_stars/web_and_ios/regular/regular_2_half.png'
        case 2:
          return '/static/yelp_stars/web_and_ios/regular/regular_2.png'
        case 1.5:
          return '/static/yelp_stars/web_and_ios/regular/regular_1_half.png'
        case 1:
          return '/static/yelp_stars/web_and_ios/regular/regular_1.png'
        default:
          return '/static/yelp_stars/web_and_ios/regular/regular_0.png'
      }
    }
  },
  methods: {
    shareOnTwitter () {
      const tweetUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('I\'m going to ') + encodeURIComponent(this.bardata.name) + encodeURIComponent(' tonight, come join me!')
      window.open(tweetUrl)
    }
  }
}
</script>

<style>
.image {
  width: 225px;
  height: 225px;
}
p {
  margin-top: 5px;
  margin-bottom: 0 !important;
}
.yelpLogo {
  width: 100px;
}
</style>
