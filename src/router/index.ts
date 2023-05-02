import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Component, defineAsyncComponent } from 'vue'
import Loading from "../components/Loading.vue"
import Error from "../components/Error.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: lazyLoadView(import('../views/HomeView.vue'))
  },

  {
    path: '/times/sun',
    name: "timesData",
    component: lazyLoadView(import('../views/TimesView.vue'))
  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: lazyLoadView(import('../views/AboutView.vue'))
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


//Components lazyloader
function lazyLoadView (AsyncView: Promise<Component>) {
  const AsyncComp = defineAsyncComponent({
    // The factory function
    loader: () => AsyncView,
    // A component to use while the async component is loading
    loadingComponent: Loading,
    // A component to use if the load fails
    errorComponent: Error,
    // Delay before showing the loading component. Default: 200ms.
    delay: 5,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 30000,
    // Defining if component is suspensible. Default: true.
    suspensible: false,
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError (error, retry, fail, attempts) {
      if (error.message.match(/fetch/) && attempts <= 3) {
        // retry on fetch errors, 3 max attempts
        retry()
      } else {
        // Note that retry/fail are like resolve/reject of a promise:
        // one of them must be called for the error handling to continue.
        fail()
      }
    },
  })

  return AsyncComp
}

export default router
