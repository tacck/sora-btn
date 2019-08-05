<template>
  <div v-bind:class="position">
    <div class="title">{{ title }}</div>
    <div>latitude: {{ latitude }}</div>
    <div>longitude: {{ longitude }}</div>
  </div>
</template>

<script>
export default {
  props: ['title', 'position', 'latitude', 'longitude']
}
</script>

<style scoped>
.title {
  margin: 10px 10px;
}
.left {
  background-color: #ffece7
}
.right {
  background-color: #dce1fc
}
</style>
