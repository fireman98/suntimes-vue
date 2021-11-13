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
    <input
      class="time-selector__range"
      type="range"
      v-model="rangeValue"
      :min="activePeriod.rangeMin"
      :max="
        typeof activePeriod.rangeMax === 'function'
          ? activePeriod.rangeMax()
          : activePeriod.rangeMax
      "
    />
    <button
      class="image-icon-wrapper time-selector__button"
      title="Go to current time"
      @click="goNow"
    >
      <i class="fas fa-history"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

class Period {
  name;
  rangeMax;
  rangeMin;
  step;
  getValue; //Function; If parameter is number => return a date, else if parameter is undefined return number
  label;

  constructor(
    name: string,
    rangeMax: number | (() => number),
    rangeMin: number | (() => number),
    step: number,
    getValue: (val?: any) => any,
    label: string
  ) {
    this.name = name;
    this.rangeMax = rangeMax;
    this.rangeMin = rangeMin;
    this.step = step;
    this.getValue = getValue;
    this.label = label;
  }
}

function days_of_a_year(year: number) {
  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year: number) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function dayOfYear(date: Date) {
  const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let mn = date.getMonth();
  let dn = date.getDate();
  let dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && isLeapYear(date.getFullYear())) dayOfYear++;
  return dayOfYear;
}

@Options({
  props: {
    time: {
      required: true,
    },
  },
})
export default class TimeSelector extends Vue {
  time!: Date;
  activePeriod!: Period;
  periods!: Period[];

  data() {
    return {
      periods: [
        new Period(
          "year",
          () => {
            return days_of_a_year(this._time.getFullYear());
          },
          1,
          86400000,
          (val) => {
            val = Number(val);
            if (!isNaN(val)) {
              let tmpDate = new Date(this._time);
              tmpDate.setUTCMonth(0);
              tmpDate.setUTCDate(0);
              return new Date(tmpDate.getTime() + this.activePeriod.step * val);
            } else {
              return dayOfYear(this._time);
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
            val = Number(val);
            if (!isNaN(val)) {
              const hours = Math.floor(val / 60);
              const minutes = val % 60;
              let tmpDate = new Date(this._time);
              tmpDate.setHours(hours);
              tmpDate.setMinutes(minutes);
              return new Date(tmpDate);
            } else {
              return this._time.getHours() * 60 + this._time.getMinutes();
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
            val = Number(val);
            if (!isNaN(val)) {
              let tmpDate = new Date(this._time);
              tmpDate.setMinutes(val);
              return new Date(tmpDate);
            } else {
              return this._time.getMinutes();
            }
          },
          "Óra"
        ),
      ],
    };
  }

  get _time() {
    return this.time;
  }

  set _time(val) {
    this.stopTick();
    this.$emit("update:time", val);
  }

  get rangeValue() {
    return this.activePeriod.getValue();
  }

  set rangeValue(val) {
    this._time = this.activePeriod.getValue(val);
  }

  get days_this_year() {
    return days_of_a_year(this._time.getFullYear());
  }

  stopTick() {
    this.$emit("stop-tick");
  }

  goNow() {
    this.$emit("go-now");
  }

  goLeft() {
    this._time = new Date(this._time.getTime() - this.activePeriod.step);
  }

  goRight() {
    this._time = new Date(this._time.getTime() + this.activePeriod.step);
  }

  created() {
    this.activePeriod = this.periods[1];
  }
}
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