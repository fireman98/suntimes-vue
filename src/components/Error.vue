<template>
  <div class="progress error state">
    <div class="determinate"></div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Error extends Vue {}
</script>