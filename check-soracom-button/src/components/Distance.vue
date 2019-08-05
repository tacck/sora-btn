<template>
  <div class="distance">
    Distance: {{ distance }} m
  </div>
</template>

<script>
export default {
  computed: {
    distance: function () {
      console.log('Distance.vue:' + JSON.stringify(this.$store.state.distance))
      if (this.$store.state.buttonPosition.latitude != 0) {
        return this.$store.state.distance.value
      }
      return 0
    }
  }
}
</script>


<style scoped>
.distance {
  background-color: #eeeeee
}
</style>
