<template>
  <div class="progress state">
    <div class="indeterminate"></div>
  </div>
</template>
<script lang="ts">import { defineComponent, onMounted, onUnmounted } from "vue"

export default defineComponent({
  name: "LoadingComponent",
  setup () {
    onMounted(() => {
      console.log("Loading...")
    })

    onUnmounted(() => {
      console.log("loaded")
    })
  }
})
</script>