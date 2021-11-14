<template>
  <div class="suntimes__wrapper" :style="styleForWrapper">
    <div class="background background__current"></div>
    <div class="background background__next"></div>
    <div class="suntimes__header">
      <h1>Suntimes</h1>
      <div class="suntimes__header__buttons">
        <button
          class="image-icon-wrapper location-settings__button btn"
          :class="{ 'btn--active': locationSettingsActive }"
          title="Location"
          @click="locationSettingsActive = !locationSettingsActive"
        >
          <i class="fas fa-map-marker-alt"></i>
        </button>
        <button disabled class="image-icon-wrapper btn">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>
    <div class="suntimes__modals">
      <div class="suntimes__modals__modal" v-show="locationSettingsActive">
        <location-settings
          :lng="lng"
          :lat="lat"
          @update:lng="lng = $event"
          @update:lat="lat = $event"
          @geolocate="geolocate"
        />
      </div>
    </div>
    <div>
      <span>Jelenlegi idő</span>
      <span class="notranslate">{{ strftime("%Y.%m.%d. %H:%M:%S", now) }}</span>
      <br />
      <span>Napfelkelte:</span>
      <span class="notranslate">{{
        strftime("%H:%M:%S", sunTimes.sunrise)
      }}</span>
      <br />
      <span>Naplemente:</span>
      <span class="notranslate">{{
        strftime("%H:%M:%S", sunTimes.sunset)
      }}</span>
      <br />
      <span>Nap hossza:</span>
      <span class="notranslate">{{
        format_timespan(sunTimes.day_length)
      }}</span>
      <br />
      <span>Altitude:</span>
      <span class="notranslate">{{ sunPosition.altitude.toFixed(3) }} deg</span>
      <br />
      <span>Altitude rate:</span>
      <span class="notranslate">{{ altituderate.toFixed(2) }} deg / 5min</span>
      <br />
      <span>Azimuth:</span>
      <span class="notranslate">{{ sunPosition.azimuth.toFixed(3) }} deg</span>
      <br />
      <span>Százalék:</span>
      <span class="notranslate">{{ percentage.toFixed(3) }} %</span>
      <br />
      <div class="progress sunpercentage" :value="percentage">
        <div class="determinate" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>
    <time-selector
      :time="now"
      @update:time="now = $event"
      @stop-tick="stopTick"
      @go-now="startTick"
    />
    <div>
      Sun data by:
      <a href="https://www.npmjs.com/package/suncalc"
        >https://www.npmjs.com/package/suncalc</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SunCalc from "suncalc";
import strftime from "strftime";
import { SkyEffect } from "../classes/SkyEffect";
import LocationSettings from "./LocationSettings.vue";
import TimeSelector from "./TimeSelector.vue";

function radians_to_degrees(radians: number) {
  const pi = Math.PI;
  return radians * (180 / pi);
}

/**
 * Timespan in ms
 */
function format_timespan(timespan: number) {
  timespan = Math.floor(timespan / 1000);

  let hours = Math.floor(timespan / 3600);
  timespan = timespan % 3600;
  let minutes = Math.floor(timespan / 60);
  timespan = timespan % 60;
  let seconds = timespan;

  let hours_s = String(hours),
    minutes_s = String(minutes),
    seconds_s = String(seconds);

  if (hours < 10) hours_s = "0" + hours;
  if (minutes < 10) minutes_s = "0" + minutes;
  if (seconds < 10) seconds_s = "0" + seconds;

  return `${hours_s}:${minutes_s}:${seconds_s}`;
}

@Options({
  emits: {
    "set-route-class": String,
  },

  components: {
    LocationSettings,
    TimeSelector,
  },

  watch: {
    lng(newVal) {
      localStorage.setItem("lng", newVal);
    },

    lat(newVal) {
      localStorage.setItem("lat", newVal);
    },

    now(newVal) {
      if (this.year != newVal.getFullYear()) this.year = newVal.getFullYear();
      if (this.month != newVal.getMonth()) this.month = newVal.getMonth();
      if (this.day != newVal.getDate()) this.day = newVal.getDate();
    },

    backgroundColor: {
      handler(newVal) {
        this.styles.backgroundSunCurrent = newVal.current;
        this.styles.backgroundSunNext = newVal.next;
        this.styles.backgroundSunPrimary =
          this.sunPosition.altitude > 10 ? "white" : "black";
        this.styles.opacitySunNext = newVal.nextOpacity;
      },
      immediate: true,
    },

    foregroundColor: {
      handler(newVal) {
        this.styles.foregroundSun = newVal;
      },
      immediate: true,
    },
  },
})
export default class Suntimes extends Vue {
  now: Date = new Date();
  tickTask: number | undefined = undefined;
  tickInterval = 250;
  loading = true;

  lastaltitude = 0;
  altituderate = 0;

  year = 0;
  month = 0;
  day = 0;

  lng = 0;
  lat = 0;

  skyEffect: SkyEffect = new SkyEffect({});

  locationSettingsActive = false;

  styles = {
    backgroundSunCurrent: "#ffffff",
    backgroundSunNext: "#ffffff",
    foregroundSun: "#000000",
    backgroundSunPrimary: "#ffffff",
    opacitySunNext: 0,
  };

  get percentage(): number {
    if (!this.sunTimes.sunrise || !this.sunTimes.sunset || !this.now) return 0;

    let _sunset = this.sunTimes.sunset.getTime(),
      _sunrise = this.sunTimes.sunrise.getTime(),
      _now = this.now.getTime();

    _now -= _sunrise;
    _sunset -= _sunrise;

    return (_now / _sunset) * 100;
  }

  get sunTimes() {
    let _now = new Date(this.now);
    let _times = SunCalc.getTimes(_now, this.lat, this.lng);

    return {
      ..._times,
      day_length: _times.sunset.getTime() - _times.sunrise.getTime(),
    };
  }

  get sunPosition() {
    let _position = SunCalc.getPosition(this.now, this.lat, this.lng);

    this.altituderate = radians_to_degrees(
      ((_position.altitude - this.lastaltitude) / this.tickInterval) * 60000 * 5
    ); //one min
    this.lastaltitude = _position.altitude;
    return {
      ..._position,
      altitude: radians_to_degrees(_position.altitude),
      azimuth: radians_to_degrees(_position.azimuth) + 180,
    };
  }

  get backgroundColor() {
    this.skyEffect.altitude = Number(this.sunPosition.altitude);
    this.skyEffect.direction = Boolean(this.percentage < 50);
    return this.skyEffect.getLinearGradient();
  }

  get foregroundColor() {
    return this.sunPosition.altitude > 10 ? "black" : "white";
  }

  get styleForWrapper() {
    return {
      "--background-sun-current": this.styles.backgroundSunCurrent,
      "--background-sun-next": this.styles.backgroundSunNext,
      "--foreground-sun": this.styles.foregroundSun,
      "--background-sun-primary": this.styles.backgroundSunPrimary,
      "--opacity-sun-next": this.styles.opacitySunNext,
    };
  }

  /**
   * Tick clock
   */
  tick() {
    this.now = new Date();
  }

  geolocate() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

  refresh() {
    this.now = new Date();
  }

  skyEffectDemo(step = 1, hour = 0, total = 1440) {
    clearInterval(this.tickTask);
    this.now.setHours(hour, 0, 0, 0);

    for (let index = 0; index < total / step; index++) {
      setTimeout(() => {
        this.now = new Date(this.now.getTime() + step * 60000);
      }, index * 50);
    }
  }

  //Start tick task
  startTick() {
    if (this.tickTask) return;

    this.tickTask = setInterval(this.tick, this.tickInterval);
  }

  //Clear tick task
  stopTick() {
    clearInterval(this.tickTask);
    this.tickTask = undefined;
  }

  strftime = strftime;
  format_timespan = format_timespan;

  created() {
    //Setup clocktick
    this.startTick();

    //Check localstrorage for longitude and latitude and set;
    let _lng = Number(localStorage.getItem("lng")),
      _lat = Number(localStorage.getItem("lat"));

    if (!isNaN(_lng)) this.lng = _lng;

    if (!isNaN(_lat)) this.lat = _lat;
  }

  beforeUnmount() {
    this.stopTick();
  }
}
</script>
<style lang="scss" scoped>
@use "@/scss/init/variables" as *;

.sunpercentage {
  width: 100%;
}

.suntimes {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    position: relative;
    &__buttons {
      button {
        margin-left: 10px;
      }
      i {
        font-size: 3rem;
      }
    }
  }

  &__modals {
    position: relative;
    z-index: 1;

    &__modal {
      position: absolute;
      top: 0;
      right: 0;
      border: 1px solid $lighterblue;
      border-radius: 4px;
      padding: 10px;
      background: var(--background-sun-primary);
    }
  }

  &__wrapper {
    --background-sun-current: #ffffff;
    --background-sun-next: #ffffff;
    --foreground-sun: #000000;
    --background-sun-primary: $light;
    --opacity-sun-next: 0;
    position: relative;
    color: var(--foreground-sun);

    .mui-select__menu {
      color: #000000 !important;
    }

    input,
    select {
      color: var(--foreground-sun) !important;
    }

    label {
      color: var(--foreground-sun) !important;
    }
  }
}

a {
  color: $red;
}

::v-deep {
  .image-icon-wrapper {
    color: var(--foreground-sun);
  }
}

.background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  &__current {
    opacity: 1;
    background: var(--background-sun-current);
    z-index: -2;
  }

  &__next {
    z-index: -1;
    opacity: var(--opacity-sun-next);
    background: var(--background-sun-next);
  }
}
</style>