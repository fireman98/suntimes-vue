<template>
  <div class="position-wrapper">
    <div class="mui-textfield">
      <input
        id="suntimes-latitude-input"
        type="number"
        v-model="_lat"
        step="any"
      />
      <label for="suntimes-latitude-input">Latitude</label>
    </div>
    <div class="mui-textfield">
      <input
        id="suntimes-longitude-input"
        type="number"
        v-model="_lng"
        step="any"
      />
      <label for="suntimes-longitude-input">Longitude</label>
    </div>
    <button type="button" class="mui-btn mui-btn--primary" @click="geolocate">
      Geolocate
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    lat: Number,
    lng: Number,
  },
})
export default class LocationSettings extends Vue {
  lat!: number;
  lng!: number;

  get _lat() {
    return this.lat;
  }

  set _lat(val) {
    this.$emit("update:lat", val);
  }

  get _lng() {
    return this.lng;
  }

  set _lng(val) {
    this.$emit("update:lng", val);
  }

  geolocate() {
    this.$emit("geolocate");
  }
}
</script>

<style lang="scss">
@use "@/scss/init/variables" as *;

.position {
  &-wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>