// vuex.d.ts
import { Store } from 'vuex'
import { SuntimesState } from "@/store/suntimes/index"

declare module '@vue/runtime-core' {
    // declare your own store states
    interface State {
        Suntimes: SuntimesState
    }

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}