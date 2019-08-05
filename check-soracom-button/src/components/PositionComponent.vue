<template>
  <div id="position-container">
    <Position title="Current Position" position="left" v-bind:latitude="this.$store.state.currentPosition.latitude" v-bind:longitude="this.$store.state.currentPosition.longitude"></Position>
    <Position title="Button Position" position="right" v-bind:latitude="this.$store.state.buttonPosition.latitude" v-bind:longitude="this.$store.state.buttonPosition.longitude"></Position>
  </div>
</template>

<script>
import Position from './Position'

export default {
  data: function () {
    return {}
  },
  components: {
    Position
  }
}
</script>

<style scoped>
#position-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
