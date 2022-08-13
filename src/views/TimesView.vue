<template>
  <div class="view__times">
    <h1>Times - {{ monthName }}</h1>
    <div class="view__times__times-table">
      <TimesParameters v-model:from="from" v-model:viewType="viewType"></TimesParameters>
      <TimesTable :from="from" :to="to" :viewType="viewType"></TimesTable>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import { Options, Vue } from "vue-class-component"
import { SuntimesViewType } from "@/interfaces/Suntimes"

import TimesParameters from "@/components/TimesParameters.vue"
import TimesTable from "@/components/TimesTable.vue"

@Options({
  components: {
    TimesParameters,
    TimesTable,
  },
})
export default class TimesView extends Vue {
  from = DateTime.now().startOf("month");
  viewType: SuntimesViewType = SuntimesViewType.SUN;

  get to () {
    return this.from.plus({ months: 1 }).endOf("month")
  }

  get monthName () {
    return this.from.toFormat("LLLL")
  }
}
</script>
