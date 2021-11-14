<template>
  <div class="progress state">
    <div class="indeterminate"></div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Loading extends Vue {
  created() {
    console.log("Loading...");
  }
  beforeDestroy() {
    console.log("loaded");
  }
}
</script>