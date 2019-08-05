<template>
  <div id="map-container"></div>
</template>

<script>
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  props: ['lat', 'lon'],
  computed: {
    latitude: function () {
      return this.$store.state.currentPosition.latitude
    },
    longitude: function () {
      return this.$store.state.currentPosition.longitude
    },
    buttonLatitude: function () {
      return this.$store.state.buttonPosition.latitude
    },
    buttonLongitude: function () {
      return this.$store.state.buttonPosition.longitude
    }
  },
  data: function () {
    return {
      map: null,
      currentCircle: null,
      currentPoint: null,
      buttonCircle: null,
      buttonPoint: null,
      zoom: 17
    }
  },
  mounted () {
    console.log('Map.vue mounted')
    // 地図作成
    this.map = L.map('map-container')
      .setView([this.latitude, this.longitude], 17)
      .addLayer(
        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution:
            'Map data &copy <a href="https://openstreetmap.org">OpenStreetMap</a>'
        })
      )

    // 現在位置へ
    setTimeout(() => {
      this.map.panTo([this.latitude, this.longitude])
      this.currentCircle = L.circle([this.latitude, this.longitude], {
        color: '#EE3300',
        fillColor: '#EE3300',
        fillOpacity: 0.25,
        radius: 50
      }).addTo(this.map)
      this.currentPoint = L.circle([this.latitude, this.longitude], {
        color: '#EE3300',
        fillColor: '#EE3300',
        fillOpacity: 1,
        radius: 5
      }).addTo(this.map)
    }, 500)

    this.$store.commit('currentPositionUpdateCallback', this.updateCurrentPosition)
    this.$store.commit('setButtonPositionUpdateCallback', this.updateButtonPosition)
  },
  methods: {
    updateCurrentPosition: async function () {
      if (this.map) {
        this.map.panTo([this.latitude, this.longitude])
      }

      if (this.currentCircle) {
        this.currentCircle.setLatLng([this.latitude, this.longitude])
      }
      if (this.currentPoint) {
        this.currentPoint.setLatLng([this.latitude, this.longitude])
      }

      const response = await axios.get(`/api/distance?latitude=${this.latitude}&longitude=${this.longitude}`)
      console.log(response.data)
      this.$store.commit('setDistance', response.data)
    },
    updateButtonPosition: function () {
      console.log('updateButtonPosition')
      console.log([this.buttonLatitude, this.buttonLongitude])

      if (this.buttonCircle === null) {
        this.buttonCircle = L.circle([this.buttonLatitude, this.buttonLongitude], {
          color: '#0099AA',
          fillColor: '#0099AA',
          fillOpacity: 0.25,
          radius: 50
        }).addTo(this.map)
      }

      if (this.buttonPoint === null) {
        this.buttonPoint = L.circle([this.buttonLatitude, this.buttonLongitude], {
          color: '#0099AA',
          fillColor: '#0099AA',
          fillOpacity: 1,
          radius: 5
        }).addTo(this.map)
      }

      this.buttonCircle.setLatLng([this.buttonLatitude, this.buttonLongitude])
      this.buttonPoint.setLatLng([this.buttonLatitude, this.buttonLongitude])
    }
  }
}
</script>

<style scoped>
#map-container {
  height: auto;
}

.leaflet-container {
  z-index: 0;
}
</style>
