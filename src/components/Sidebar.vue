<template>
  <nav class="sidebar-wrapper">
    <div class="sidebar" :class="{ active: active }">
      <div>
        <ul>
          <li v-for="link in routes" :key="link.path" @click="$emit('sidebaroff')">
            <router-link :to="link.path" active-class="active">{{
            getTitle(link)
            }}</router-link>
          </li>
          <li v-for="link in additional_routes" :key="link.path">
            <a :href="link.path">{{ link.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <transition name="fade">
      <div class="overlay" v-show="active" @click="$emit('sidebaroff')"></div>
    </transition>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { RouteRecordRaw, useRouter } from "vue-router"

export default defineComponent({
  name: "PageSidebar",
  props: {
    active: { type: Boolean },
  },

  emits: {
    'sidebaroff': () => true
  },

  setup () {
    const router = useRouter()

    //Define additional routes that not belong to the application
    const additional_routes = [
      {
        name: "Github",
        path: "https://github.com/fireman98/suntimes-vue",
      },
    ]

    const routes = computed(() => {
      return router.options.routes

    })

    const getTitle = (route: RouteRecordRaw) => {
      if (!(typeof route === "object" && route !== null)) return "Invalid input"

      if (route.meta && route.meta.title) return route.meta.title

      if (route.name) return route.name

      if (route.path) return route.path

      return route
    }

    return {
      routes, getTitle, additional_routes
    }
  }
})
</script>
<style lang="scss" scoped>
@use "@/scss/init/variables" as *;

.sidebar {
  z-index: 6;
  right: -#{$sidebar-width};
  top: 0;
  width: $sidebar-width;
  height: 100%;
  position: fixed;
  background-color: black;
  transition: right 0.5s ease;
  border-left: 3px solid $blue;

  &.active {
    right: 0;
  }

  ul {
    margin-top: $header-height;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 0px;
  }

  li {
    padding: 10px;
    list-style-type: none;
    border-bottom: 1px solid $dark;
    text-align: right;

    &:hover {
      a {
        color: $medium;
        text-shadow: 0px 0px 1px $medium;
      }
    }
  }

  a {
    transition: color 1s, text-shadow 1s;
    color: white;
    font-size: 1.6rem;

    &.router-link-exact-active {
      color: $blue;
      text-shadow: 0px 0px 1px $blue;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $lightblue;
  background-image: linear-gradient(141deg,
      $lighterblue 0%,
      $lightblue 51%,
      $mediumblue 75%);
  z-index: 5;
  cursor: pointer;
  filter: opacity(0.7);

}
</style>