<template>
  <div id="main">
    <PositionComponent></PositionComponent>
    <Distance></Distance>
    <Map v-bind:lat="lat"  v-bind:lon="lon"></Map>
  </div>
</template>

<script>
import Map from './Map'
import PositionComponent from './PositionComponent'
import Distance from './Distance'

import io from 'socket.io-client'

export default {
  components: {
    Map,
    PositionComponent,
    Distance
  },
  data: function () {
    return {
      lat: 43.0680165,
      lon: 141.3519007,
      socket: io()
    }
  },
  mounted: function () {
    console.log('Main.vue mounted')
    this.$store.commit('setCurrenctPosition', {
      latitude: this.lat,
      longitude: this.lon
    })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.$store.commit('setCurrenctPosition', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })

        console.log(position.coords.latitude, position.coords.longitude)
      })

      navigator.geolocation.watchPosition((position) => {
        this.$store.commit('setCurrenctPosition', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      })
    }

    this.socket.on('getButtonPosition', (data) => {
      console.log("Main.vue getButtonPosition:" + data)
      this.$store.commit('setButtonPosition', JSON.parse(data))
    })
  }
}
</script>

<style scoped>
#main {
  height: 100%;
  display: grid;
  grid-template-rows: 10em 4em 1fr;
}
</style>
