<template>
  <tr class="times-row">
    <td v-for="(column, index) of columns" :key="index">{{ column }}</td>
  </tr>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import SunCalc from "suncalc";
import SuntimesUtility, {
  GetTimesResultLuxon,
} from "@/classes/SuntimesUtility";
import useColumnsForHeadings from "@/composables/useColumnsForHeadings";
import { toRef, defineComponent, ref, ComponentPropsOptions } from "vue";
import { PropOptions } from "vue-class-component";

export default defineComponent({
  props: {
    date: {
      type: DateTime,
      required: true,
    },

    viewType: {
      type: String,
    },

    headings: {
      type: Array as () => Array<string>,
      default: (): string[] => [],
      required: true,
    },
  },

  setup($props) {
    const headings = toRef($props, "headings");
    const date = toRef($props, "date");

    const columns = useColumnsForHeadings(headings, date);

    return {
      ...columns,
    };
  },
});
</script>
