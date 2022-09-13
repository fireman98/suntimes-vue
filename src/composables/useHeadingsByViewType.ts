import { SuntimesViewType } from './../interfaces/Suntimes'
import { formatTime } from '@/utils/LuxonUtility'
import { GetTimesResultLuxon } from '@/classes/SuntimesUtility'
import { computed, Ref, toRef, } from 'vue'

const sunViewHeadings = ["date", "dawn", "sunrise", "sunset", "dusk"]
const otherHeadings: Array<string> = ["date", "moonrise"]


export default function useHeadingsByViewType (viewType: Ref<SuntimesViewType>) {

    const headings = computed(() => viewType.value === SuntimesViewType.SUN ? sunViewHeadings : otherHeadings)

    return headings

}
