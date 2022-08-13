<template>
  <table class="times-table">
    <thead>
      <th v-for="(heading, index) of headings" :key="index">
        {{ heading }}
      </th>
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
import SuntimesUtility from "@/classes/SuntimesUtility"

import useHeadingsByViewType from "@/composables/useHeadingsByViewType"

import { ref, toRef, toRefs, defineComponent, computed, PropType } from "vue"
import { SuntimesViewType } from "@/interfaces/Suntimes"

export default defineComponent({
  props: {
    from: {
      type: DateTime,
      required: true,
    },

    to: {
      type: DateTime,
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

  setup ($props, $context) {
    const { from, to, viewType } = toRefs($props)

    const days = computed(() => {
      const days = to.value.diff(from.value, "day").days

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
