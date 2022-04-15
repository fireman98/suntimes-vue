<template>
  <div class="position-wrapper">
    <div class="mui-textfield">
      <input id="suntimes-latitude-input" type="number" v-model="Lat" step="any" />
      <label for="suntimes-latitude-input">Latitude</label>
    </div>
    <div class="mui-textfield">
      <input id="suntimes-longitude-input" type="number" v-model="Lng" step="any" />
      <label for="suntimes-longitude-input">Longitude</label>
    </div>
    <button type="button" class="mui-btn mui-btn--primary" @click="geolocate">
      Geolocate
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue"

export default defineComponent({
  props: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  emits: {
    "update:lat": (val: number) => true,
    "update:lng": (val: number) => true,
    "geolocate": () => true
  },
  setup (props, context) {
    const { lat, lng } = toRefs(props)

    const Lat = computed<number>({
      get () {
        return lat.value
      },
      set (val) {
        context.emit("update:lat", val)
      }
    })

    const Lng = computed<number>({
      get () {
        return lng.value
      },
      set (val) {
        context.emit("update:lng", val)
      }
    })

    const geolocate = () => {
      context.emit("geolocate")
    }

    return {
      Lat, Lng, geolocate
    }
  }
})
</script>

<style lang="scss">
@use "@/scss/init/variables"as *;

.position {
  &-wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>