<template>
  <page-header @sidebaron="sidebarActive = true"></page-header>
  <div class="content" :class="routeClass">
    <router-view class="container" @set-route-class="setRouteClass($event)"></router-view>
  </div>
  <page-sidebar @sidebaroff="sidebarActive = false" :active="sidebarActive"></page-sidebar>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue"

import PageHeader from "./components/Header.vue"
import PageSidebar from "./components/Sidebar.vue"

import "muicss/dist/js/mui.min"

export default defineComponent({
  name: "App",
  components: {
    PageHeader,
    PageSidebar,
  },

  setup () {
    const sidebarActive = ref(false)
    const routeClass = ref("")

    const unfocusButtonIfnotKeyboard = () => {
      //Blur active element if clicked or touched, but not if interacted by keyboard or accessibility tools
      const focused = document.activeElement

      if (!focused || !(focused instanceof HTMLElement)) return

      const tagnames = ["button"]
      if (!tagnames.includes(focused.tagName.toLowerCase())) return

      focused.blur()
    }

    onMounted(() => {
      window.addEventListener("mouseup", unfocusButtonIfnotKeyboard)
      window.addEventListener("touchend", unfocusButtonIfnotKeyboard)
    })

    onUnmounted(() => {
      window.removeEventListener("mouseup", unfocusButtonIfnotKeyboard)
      window.removeEventListener("touchend", unfocusButtonIfnotKeyboard)
    })

    const setRouteClass = (className: string) => {
      routeClass.value = className
    }

    return {
      sidebarActive,
      routeClass,
      setRouteClass
    }
  }
})
</script>

<style lang="scss">
@use "./scss/app.scss";
</style>
