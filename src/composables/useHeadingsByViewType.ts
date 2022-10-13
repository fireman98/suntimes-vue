import { SuntimesViewType } from './../interfaces/Suntimes'
import { computed, Ref } from 'vue'

const sunViewHeadings = ["date", "dawn", "sunrise", "sunset", "dusk"]
const otherHeadings: Array<string> = ["date", "moonrise"]


export default function useHeadingsByViewType (viewType: Ref<SuntimesViewType>) {

    const headings = computed(() => viewType.value === SuntimesViewType.SUN ? sunViewHeadings : otherHeadings)

    return headings

}
