<template>
  <table class="times-table mui-table mui-table--bordered">
    <thead>
      <tr>
        <th v-for="(heading, index) of headings" :key="index">
          {{ heading }}
        </th>
        <th class="buttons-col"></th>
      </tr>
    </thead>
    <tbody>
      <!-- Use index for key, to avoid re-creating components on day change -->
      <TimesRow v-for="(day, index) of days" :key="index" :date="day" :viewType="viewType" :headings="headings">
      </TimesRow>
    </tbody>
  </table>
</template>

<script lang="ts">
import { DateTime } from "luxon"

import TimesRow from "@/components/TimesRow.vue"

import useHeadingsByViewType from "@/composables/useHeadingsByViewType"

import { toRefs, defineComponent, computed, PropType } from "vue"
import { SuntimesViewType } from "@/interfaces/Suntimes"

export default defineComponent({
  props: {
    from: {
      type: Object as PropType<DateTime>,
      required: true,
    },

    to: {
      type: Object as PropType<DateTime>,
      required: true,
    },

    viewType: {
      type: String as PropType<SuntimesViewType>,
      default: SuntimesViewType.SUN, // Could be sun or moon
      required: true,
    },
  },

  components: {
    TimesRow,
  },

  setup ($props) {
    const { from, to, viewType } = toRefs($props)

    const days = computed(() => {
      const days = to.value.plus({ days: 1 }).diff(from.value, "day").days

      return Array.from({ length: days }, (v, i) =>
        from.value.plus({ days: i })
      )
    })

    const headings = useHeadingsByViewType(viewType)

    return {
      days,
      headings,
    }
  },
})
</script>
<style lang="scss" scoped>
:deep() {
  .buttons-col {
    width: 100px;

  }

}

.mui-table:deep() {
  >tbody>tr>td {
    padding: 5px;

  }
}

.mui-table>thead>tr>th {
  padding: 5px;
}
</style>