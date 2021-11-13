<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Suntimes msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Suntimes from "@/components/Index.vue"; // @ is an alias to /src

@Options({
  components: {
    Suntimes,
  },
})
export default class HomeView extends Vue {}
</script>
