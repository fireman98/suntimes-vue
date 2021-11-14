<template>
  <div class="view__home">
    <Suntimes @set-route-class="setRouteClass($event)" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Suntimes from "@/components/Suntimes.vue"; // @ is an alias to /src

@Options({
  emits: {
    "set-route-class": String,
  },
  components: {
    Suntimes,
  },
})
export default class HomeView extends Vue {
  setRouteClass(className: string) {
    this.$emit("set-route-class", className);
  }
}
</script>
