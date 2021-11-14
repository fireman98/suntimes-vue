<template>
  <page-header @sidebaron="sidebarActive = true"></page-header>
  <div class="content" :class="routeClass">
    <router-view
      class="container"
      @set-route-class="setRouteClass($event)"
    ></router-view>
  </div>
  <page-sidebar
    @sidebaroff="sidebarActive = false"
    :active="sidebarActive"
  ></page-sidebar>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

import PageHeader from "./components/Header.vue";
import PageSidebar from "./components/Sidebar.vue";

@Options({
  components: {
    PageHeader,
    PageSidebar,
  },
})
export default class App extends Vue {
  sidebarActive = false;
  routeClass = "";

  unfocusButtonIfnotKeyboard() {
    //Blur active element if clicked or touched, but not if interacted by keyboard or accessibility tools
    const focused = document.activeElement;

    if (!focused || !(focused instanceof HTMLElement)) return;

    const tagnames = ["button"];
    if (!tagnames.includes(focused.tagName.toLowerCase())) return;

    focused.blur();
  }

  setRouteClass(className: string) {
    this.routeClass = className;
  }

  created() {
    window.addEventListener("mouseup", this.unfocusButtonIfnotKeyboard);
    window.addEventListener("touchend", this.unfocusButtonIfnotKeyboard);
  }

  destroyed() {
    window.removeEventListener("mouseup", this.unfocusButtonIfnotKeyboard);
    window.removeEventListener("touchend", this.unfocusButtonIfnotKeyboard);
  }
}
</script>

<style lang="scss">
@use "./scss/app.scss";
</style>
