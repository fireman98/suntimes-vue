import { formatTime } from '@/utils/LuxonUtility'
import { GetTimesResultLuxon } from '@/classes/SuntimesUtility'
import { computed, Ref, toRef, } from 'vue'

const sunViewHeadings = ["date", "sunrise", "sunset", "dusk", "dawn"]
const otherHeadings: Array<string> = ["date", "moonrise"]


export default function useHeadingsByViewType (viewType: Ref<string>) {

    const headings = computed(() => viewType.value === 'sun' ? sunViewHeadings : otherHeadings)

    return headings

}
