<template>
  <div class="view__times">
    <h1>Times - {{ monthName }}</h1>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class TimesView extends Vue {
  get monthName() {
    return "January";
  }
}
</script>
