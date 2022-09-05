<template>
  <div class="suntimes__wrapper" :style="styleForWrapper">
    <div class="background background__current"></div>
    <div class="background background__next"></div>
    <div class="suntimes__header">
      <h1>Suntimes</h1>
      <div class="suntimes__header__buttons">
        <button class="image-icon-wrapper location-settings__button btn"
          :class="{ 'btn--active': locationSettingsActive }" title="Location"
          @click="openModal(locationSettingsActive ? undefined : Modal.LocationSettings)">
          <i class="fas fa-map-marker-alt"></i>
        </button>
        <button class="image-icon-wrapper general-settings__button btn"
          :class="{ 'btn--active': generalSettingsActive }"
          @click="openModal(generalSettingsActive ? undefined : Modal.GeneralSettings)">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>
    <div class="suntimes__modals">
      <div class="suntimes__modals__modal" v-show="generalSettingsActive">
        <GeneralSettings @close="generalSettingsActive = false" />
      </div>
      <div class="suntimes__modals__modal" v-show="locationSettingsActive">
        <LocationSettings :lng="lng" :lat="lat" @update:lng="lng = $event" @update:lat="lat = $event"
          @geolocate="geolocate" />
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
    <TimeSelector v-model:time="now" @stop-tick="stopTick" @go-now="startTick" />
    <SunGraph :date="currentDayLuxon" />
    <div>
      Sun data by:
      <a href="https://www.npmjs.com/package/suncalc">https://www.npmjs.com/package/suncalc</a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, reactive, Ref, ref, watch, watchEffect } from "vue"
import SunCalc from "suncalc"
import strftime from "strftime"
import { SkyEffect } from "../classes/SkyEffect"
import GeneralSettings from "./GeneralSettings.vue"
import LocationSettings from "./LocationSettings.vue"
import TimeSelector from "./TimeSelector.vue"
import SunGraph from "./SunGraph.vue"
import { useSettingsStore } from "@/stores/settingsStore"
import { storeToRefs } from "pinia"
import { DateTime } from "luxon"
import { formatYearMonthDayToISO } from "@/utils/LuxonUtility"

function radians_to_degrees (radians: number) {
  const pi = Math.PI
  return radians * (180 / pi)
}

/**
 * Timespan in ms
 */
function format_timespan (timespan: number) {
  timespan = Math.floor(timespan / 1000)

  const hours = Math.floor(timespan / 3600)
  timespan = timespan % 3600
  const minutes = Math.floor(timespan / 60)
  timespan = timespan % 60
  const seconds = timespan

  let hours_s = String(hours),
    minutes_s = String(minutes),
    seconds_s = String(seconds)

  if (hours < 10) hours_s = "0" + hours
  if (minutes < 10) minutes_s = "0" + minutes
  if (seconds < 10) seconds_s = "0" + seconds

  return `${hours_s}:${minutes_s}:${seconds_s}`
}

enum Modal {
  GeneralSettings = 'GeneralSettings',
  LocationSettings = 'LocationSettings'
}

export default defineComponent({
  name: "SuntimesRoot",
  emits: {
    "set-route-class": String,
  },
  components: {
    GeneralSettings,
    LocationSettings,
    TimeSelector,
    SunGraph,
  },

  setup () {
    const settingsStore = useSettingsStore()
    const { useSkyEffect } = storeToRefs(settingsStore)

    settingsStore.loadFromLocalStorage()

    const now = ref<Date>(new Date())
    const tickTask: Ref<number | undefined> = ref(undefined)
    const tickInterval = ref(250)
    const loading = ref(true)

    const lastaltitude = ref(0)
    const altituderate = ref(0)

    const year = ref(0)
    const month = ref(0)
    const day = ref(0)
    const currentDayLuxon = computed(() => DateTime.fromISO(formatYearMonthDayToISO(year.value, month.value, day.value)))


    const lng = ref(0)
    const lat = ref(0)

    const skyEffect = reactive(new SkyEffect({}))

    const generalSettingsActive = ref(false)
    const locationSettingsActive = ref(false)



    const openModal = (modal?: Modal) => {
      generalSettingsActive.value = locationSettingsActive.value = false


      switch (modal) {
        case Modal.GeneralSettings:
          generalSettingsActive.value = true
          break
        case Modal.LocationSettings:
          locationSettingsActive.value = true
          break
      }
    }

    const styles = reactive({
      backgroundSunCurrent: "#ffffff",
      backgroundSunNext: "#ffffff",
      foregroundSun: "#000000",
      backgroundSunPrimary: "#ffffff",
      opacitySunNext: 0,
    })

    const percentage = computed<number>(() => {
      if (!sunTimes.value.sunrise || !sunTimes.value.sunset || !now.value) return 0

      let _sunset = sunTimes.value.sunset.getTime(),
        _now = now.value.getTime()

      const _sunrise = sunTimes.value.sunrise.getTime()

      _now -= _sunrise
      _sunset -= _sunrise

      return (_now / _sunset) * 100
    })

    const sunTimes = computed(() => {
      const _now = new Date(now.value as Date)
      const _times = SunCalc.getTimes(_now, lat.value, lng.value)

      return {
        ..._times,
        day_length: _times.sunset.getTime() - _times.sunrise.getTime(),
      }
    })

    const sunPositionRaw = computed(() => SunCalc.getPosition(now.value as Date, lat.value, lng.value))
    watch(sunPositionRaw, (newVal) => {
      altituderate.value = radians_to_degrees(
        ((newVal.altitude - lastaltitude.value) / tickInterval.value) * 60000 * 5
      ) //one min
      lastaltitude.value = newVal.altitude
    })

    const sunPosition = computed(() => {
      const _position = sunPositionRaw.value
      return {
        ..._position,
        altitude: radians_to_degrees(_position.altitude),
        azimuth: radians_to_degrees(_position.azimuth) + 180,
      }
    })

    watchEffect(() => {
      if (!useSkyEffect.value)
        return

      skyEffect.altitude = Number(sunPosition.value.altitude)
      skyEffect.direction = Boolean(percentage.value < 50)
    })

    const backgroundColor = computed(() => {
      if (!useSkyEffect.value)
        return { current: "#ffffff", next: "#ffffff", nextOpacity: 0 }

      return skyEffect.getLinearGradient()
    })

    const foregroundColor = computed(() => {
      if (!useSkyEffect.value)
        return "black"

      return sunPosition.value.altitude > 10 ? "black" : "white"
    })

    const styleForWrapper = computed(() => {
      return {
        "--background-sun-current": styles.backgroundSunCurrent,
        "--background-sun-next": styles.backgroundSunNext,
        "--foreground-sun": styles.foregroundSun,
        "--background-sun-primary": styles.backgroundSunPrimary,
        "--opacity-sun-next": styles.opacitySunNext,
      }
    })

    watch(backgroundColor,
      (newVal) => {
        styles.backgroundSunCurrent = newVal.current
        styles.backgroundSunNext = newVal.next
        styles.backgroundSunPrimary =
          !useSkyEffect.value ? "white" : sunPosition.value.altitude > 10 ? "white" : "black"
        styles.opacitySunNext = newVal.nextOpacity
      }, { immediate: true })

    watch(foregroundColor,
      (newVal) => {
        styles.foregroundSun = newVal
      },
      { immediate: true }
    )

    /**
     * Tick clock
     */
    const tick = () => { now.value = new Date() }

    watch(now, (newVal) => {
      if (year.value != newVal.getFullYear()) year.value = newVal.getFullYear()
      if (month.value != newVal.getMonth()) month.value = newVal.getMonth()
      if (day.value != newVal.getDate()) day.value = newVal.getDate()
    })

    // Geolocate
    const geolocate = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        lat.value = position.coords.latitude
        lng.value = position.coords.longitude
      })
    }

    watch(lng, (newVal) => {
      localStorage.setItem("lng", newVal.toString())
    })

    watch(lat, (newVal) => {
      localStorage.setItem("lat", newVal.toString())
    })

    const refresh = () => { now.value = new Date() }

    const skyEffectDemo = (step = 1, hour = 0, total = 1440) => {
      clearInterval(tickTask.value)
      now.value.setHours(hour, 0, 0, 0)

      for (let index = 0; index < total / step; index++) {
        setTimeout(() => {
          now.value = new Date(now.value.getTime() + step * 60000)
        }, index * 50)
      }
    }

    //Start tick task
    const startTick = () => {
      if (tickTask.value) return

      tickTask.value = setInterval(tick, tickInterval.value)
    }
    // Stop tick task
    const stopTick = () => {
      clearInterval(tickTask.value)
      tickTask.value = undefined
    }

    onBeforeUnmount(() => {
      stopTick()
    })

    //Init
    //Setup clocktick
    startTick()

    //Check localstrorage for longitude and latitude and set;
    const _lng = Number(localStorage.getItem("lng")),
      _lat = Number(localStorage.getItem("lat"))

    if (!isNaN(_lng)) lng.value = _lng
    if (!isNaN(_lat)) lat.value = _lat

    return {
      styleForWrapper,
      generalSettingsActive,
      locationSettingsActive,
      openModal,
      Modal,
      lat, lng,
      geolocate,
      strftime, now, currentDayLuxon,
      sunTimes,
      format_timespan,
      sunPosition,
      altituderate,
      percentage,
      stopTick,
      startTick,
      settingsStore
    }
  }
})
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

    &:deep() {

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