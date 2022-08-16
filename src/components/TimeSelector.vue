<template>
  <div class="time-selector">
    <div class="mui-select time-selector__period-select">
      <select v-model="activePeriod">
        <option v-for="period of periods" :value="period" :key="period.name">
          {{ period.label }}
        </option>
      </select>
    </div>
    <button class="image-icon-wrapper time-selector__button" @click="goLeft">
      <i class="fas fa-chevron-left"></i>
    </button>
    <button class="image-icon-wrapper time-selector__button" @click="goRight">
      <i class="fas fa-chevron-right"></i>
    </button>
    <input class="time-selector__range" type="range" v-model="rangeValue" :min="activePeriod.rangeMin" :max="
      typeof activePeriod.rangeMax === 'function'
        ? activePeriod.rangeMax()
        : activePeriod.rangeMax
    " />
    <button class="image-icon-wrapper time-selector__button" title="Go to current time" @click="goNow">
      <i class="fas fa-history"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed } from "vue"

class Period {
  name
  rangeMax
  rangeMin
  step
  getValue //Function; If parameter is number => return a date, else if parameter is undefined return number
  label

  constructor(
    name: string,
    rangeMax: number | (() => number),
    rangeMin: number | (() => number),
    step: number,
    getValue: (val?: any) => any,
    label: string
  ) {
    this.name = name
    this.rangeMax = rangeMax
    this.rangeMin = rangeMin
    this.step = step
    this.getValue = getValue
    this.label = label
  }
}

function days_of_a_year (year: number) {
  return isLeapYear(year) ? 366 : 365
}

function isLeapYear (year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

function dayOfYear (date: Date) {
  const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let mn = date.getMonth()
  let dn = date.getDate()
  let dayOfYear = dayCount[mn] + dn
  if (mn > 1 && isLeapYear(date.getFullYear())) dayOfYear++
  return dayOfYear
}

export default defineComponent({
  name: "TimeSelector",
  props: {
    time: {
      required: true,
      type: Date
    }
  },
  setup (props, context) {
    const { time } = toRefs(props)

    const stopTick = () => {
      context.emit("stop-tick")
    }

    const _time = computed<Date>({
      get () {
        return time.value
      },

      set (val) {
        stopTick()
        context.emit("update:time", val)
      }
    })

    const rangeValue = computed({
      get () {
        return activePeriod.value.getValue()

      }, set (val) {

        _time.value = activePeriod.value.getValue(val)
      }
    })

    const days_this_year = computed(() => {
      return days_of_a_year(_time.value.getFullYear())
    })

    const periods: Period[] = [
      new Period(
        "year",
        () => {
          return days_of_a_year(_time.value.getFullYear())
        },
        1,
        86400000,
        (val) => {
          val = Number(val)
          if (!isNaN(val)) {
            let tmpDate = new Date(_time.value)
            tmpDate.setUTCMonth(0)
            tmpDate.setUTCDate(0)
            return new Date(tmpDate.getTime() + activePeriod.value.step * val)
          } else {
            return dayOfYear(_time.value)
          }
        },
        "Év"
      ),

      new Period(
        "day",
        1439,
        0,
        3600000,
        (val) => {
          val = Number(val)
          if (!isNaN(val)) {
            const hours = Math.floor(val / 60)
            const minutes = val % 60
            let tmpDate = new Date(_time.value)
            tmpDate.setHours(hours)
            tmpDate.setMinutes(minutes)
            return new Date(tmpDate)
          } else {
            return _time.value.getHours() * 60 + _time.value.getMinutes()
          }
        },
        "Nap"
      ),

      new Period(
        "hour",
        59,
        0,
        60000,
        (val) => {
          val = Number(val)
          if (!isNaN(val)) {
            let tmpDate = new Date(_time.value)
            tmpDate.setMinutes(val)
            return new Date(tmpDate)
          } else {
            return _time.value.getMinutes()
          }
        },
        "Óra"
      ),
    ]
    const activePeriod = ref(periods[1])

    const goNow = () => {
      context.emit("go-now")
    }

    const goLeft = () => {
      _time.value = new Date(_time.value.getTime() - activePeriod.value.step)
    }

    const goRight = () => {
      _time.value = new Date(_time.value.getTime() + activePeriod.value.step)
    }

    return {
      activePeriod,
      periods,
      goLeft,
      goRight,
      rangeValue,
      goNow
    }
  }
})
</script>

<style lang="scss">
.time-selector {
  display: flex;
  position: relative;

  &__range {
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
  }

  &__button {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 2rem;
  }

  &__period-select {
    margin-right: 5px;
  }
}
</style>