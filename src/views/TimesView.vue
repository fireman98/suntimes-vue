<template>
  <div class="view__times">
    <h1>Times - {{ monthName }}</h1>
    <div class="view__times__times-table">
      <times-table :from="from" :to="to" :viewType="viewType"></times-table>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import { Options, Vue } from "vue-class-component";

import TimesTable from "@/components/TimesTable.vue";

@Options({
  components: {
    TimesTable,
  },
})
export default class TimesView extends Vue {
  from = DateTime.now().startOf("month");
  viewType = "sun";

  get to() {
    return this.from.plus({ months: 1 }).endOf("month");
  }

  get monthName() {
    return this.from.toFormat("LLLL");
  }
}
</script>
