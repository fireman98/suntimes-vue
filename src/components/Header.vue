<template>
  <header class="header" :class="{ hidden: hidden, ontop: ontop }">
    <div class="container">
      <div class="companyName">
        <router-link to="/">Kezdőlap</router-link>
      </div>
      <div class="links">
        <button class="image-icon-wrapper" aria-label="Oldalmenü megnyitása" title="Oldalmenü"
          @click="$emit('sidebaron')">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue"

export default defineComponent({
  name: "PageHeader",
  emits: {
    sidebaron: null,
  },
  setup () {

    const lastScrollTop = ref(0)
    const hidden = ref(false)
    const ontop = ref(true)

    const scrollHandler = () => {
      hidden.value = lastScrollTop.value < document.documentElement.scrollTop
      ontop.value = !document.documentElement.scrollTop
      lastScrollTop.value = document.documentElement.scrollTop
    }

    onMounted(() => {
      window.addEventListener("scroll", scrollHandler, { passive: true })
    })

    onUnmounted(() => {
      window.removeEventListener("scroll", scrollHandler)
    })

    return {
      hidden,
      ontop
    }

  }
})
</script>
<style lang="scss" scoped>
@use "@/scss/init/variables"as *;

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0;
  height: $header-height;
  background-color: black;
  border-bottom: 3px solid $blue;
  transition: top 0.5s ease;
  z-index: 2;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .companyName {
    font-size: 1.6rem;

    a {
      color: $lighter;
    }
  }

  .links {
    .fa-bars {
      font-size: 3rem;
      cursor: pointer;
      color: $lighter;
    }
  }

  &.ontop {
    background-color: rgba($color: #000000, $alpha: 0.7);
    border-bottom-color: transparent;
    //mix-blend-mode: difference;

    .companyName a {
      color: white;
    }

    .fa-bars {
      color: white;
    }
  }

  &.hidden {
    top: -6rem;
  }
}
</style>