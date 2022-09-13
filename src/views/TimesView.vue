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
import { computed, defineComponent, Ref, ref } from "vue"
import { DateTime } from "luxon"
import { SuntimesViewType } from "@/interfaces/Suntimes"

import TimesParameters from "@/components/TimesParameters.vue"
import TimesTable from "@/components/TimesTable.vue"

export default defineComponent({
  name: "TimesView",
  components: {
    TimesParameters,
    TimesTable,
  },
  setup () {
    const from = ref(DateTime.now().startOf("month"))
    const viewType: Ref<SuntimesViewType> = ref(SuntimesViewType.SUN)

    const to = computed(() => {
      return from.value.endOf("month")
    })

    const monthName = computed(() => {
      return from.value.toFormat("LLLL")
    })

    return {
      from,
      viewType,
      to,
      monthName
    }
  }
})
</script>
