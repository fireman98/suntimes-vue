<template>
  <tr class="times-row">
    <td v-for="(column, index) of columns" :key="index">{{ column }}</td>
    <td class="buttons-col">
      <button class="mui-btn mui-btn--small mui-btn--primary" @click="toggleIsOpened">
        <i class="fas fa-caret-down"></i>
      </button>
    </td>
  </tr>
  <tr v-show="isOpened">
    <td colspan="6">
      <KeepAlive>
        <SunGraph v-if="isOpened" :date="date" :animate="false" />
      </KeepAlive>
    </td>
  </tr>
</template>

<script lang="ts">
import { DateTime } from "luxon"
import useColumnsForHeadings from "@/composables/useColumnsForHeadings"
import { toRef, defineComponent, ref, PropType } from "vue"
import { SuntimesViewType } from "@/interfaces/Suntimes"
import SunGraph from "./SunGraph.vue"

export default defineComponent({
  name: "TimesRow",
  components: {
    SunGraph
  },
  props: {
    date: {
      type: Object as PropType<DateTime>,
      required: true,
    },

    viewType: {
      type: String as PropType<SuntimesViewType>,
    },

    headings: {
      type: Array as () => Array<string>,
      default: (): string[] => [],
      required: true,
    },
  },

  setup ($props) {
    const headings = toRef($props, "headings")
    const date = toRef($props, "date")

    const columns = useColumnsForHeadings(headings, date)

    const isOpened = ref(false)
    const toggleIsOpened = () => { isOpened.value = !isOpened.value }

    return {
      ...columns,
      isOpened,
      toggleIsOpened
    }
  },
})
</script>
<style lang="scss" scoped>
:deep() {
  .sun-graph>canvas {
    max-height: 200px;
    height: 200px;

  }
}

.buttons-col {
  button {
    margin: 0;
  }
}
</style>