<template>
  <div class="position-wrapper">
    <div class="mui-textfield">
      <input id="suntimes-address-input" type="text" v-model="address" placeholder="Enter a city"
        @keydown.enter="geocodeAndSave" />
      <label for="suntimes-address-input">Address</label>
      <div class="position__addressDisplay">
        {{addressDisplay}}
      </div>
    </div>
    <div class="mui-divider"></div>
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
import { computed, defineComponent, ref, toRefs } from "vue"
import useGeocode from "../composables/useGeocode"


export default defineComponent({
  props: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  emits: {
    "update:lat": (val: number) => typeof val === 'number',
    "update:lng": (val: number) => typeof val === 'number',
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

    // Geocoding
    const address = ref("")
    const addressDisplay = ref("")

    const { geocode } = useGeocode()

    /**
     * Geocode address, if successful save coordinates to lat and lng
     */
    const geocodeAndSave = async () => {
      try {
        addressDisplay.value = "..."
        const place = await geocode(address.value)
        Lat.value = Number(place.lat)
        Lng.value = Number(place.lon)
        addressDisplay.value = place.display_name
      } catch (err) {
        addressDisplay.value = "Not found"
      }
    }

    return {
      Lat, Lng, geolocate, address, geocodeAndSave, addressDisplay
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/scss/init/variables" as *;

.position {
  &-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__addressDisplay {
    margin-top: 10px;
    margin-bottom: 5px;
  }
}
</style>