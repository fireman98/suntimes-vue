<template>
  <header class="header" :class="{ hidden: hidden, ontop: ontop }">
    <div class="container">
      <div class="companyName">
        <router-link to="/">Kezdőlap</router-link>
      </div>
      <div class="links">
        <button
          class="image-icon-wrapper"
          aria-label="Oldalmenü megnyitása"
          title="Oldalmenü"
          @click="$emit('sidebaron')"
        >
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: {
    sidebaron: null,
  },
})
export default class PageHeader extends Vue {
  lastScrollTop = 0;
  hidden = false;
  ontop = true;

  scrollHandler() {
    this.hidden = this.lastScrollTop < document.documentElement.scrollTop;

    this.ontop = !document.documentElement.scrollTop;

    this.lastScrollTop = document.documentElement.scrollTop;
  }

  created() {
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }

  destroyed() {
    window.removeEventListener("scroll", this.scrollHandler);
  }
}
</script>
<style lang="scss" scoped>
@use "@/scss/init/variables" as *;
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