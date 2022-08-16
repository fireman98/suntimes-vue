<template>
  <div class="view__home">
    <Suntimes @set-route-class="setRouteClass($event)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import Suntimes from "@/components/Suntimes.vue" // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    Suntimes
  },
  emits: {
    "set-route-class": String,
  },
  setup (_props, context) {
    const setRouteClass = (className: string) => {
      context.emit("set-route-class", className)
    }

    return {
      setRouteClass
    }
  }
})

</script>
