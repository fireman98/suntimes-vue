import { computed, ComputedRef, Ref } from "vue"
import { formatTime } from "@/utils/LuxonUtility"
import { DateTime } from "luxon"
import SuntimesUtility, { GetTimesResultLuxon } from "@/classes/SuntimesUtility"
import SunCalc from "suncalc"


export default function useColumnsForHeadings (headings: Ref<string[]>, date: Ref<DateTime>) {

    const ISODate = computed(() => {
        return date.value.toISODate()
    })

    const timesResult = computed((): GetTimesResultLuxon => {
        return SuntimesUtility.transformGetTimesResultDatesToLuxon(
            SunCalc.getTimes(date.value.toJSDate(), 0, 0) // TODO: use actual location
        )
    })

    const columns = computed(() => headings.value.map(x => {
        switch (x) {
            case "date":
                return ISODate.value
            case "sunrise":
                return formatTime(timesResult.value.sunrise)

            case "sunset":
                return formatTime(timesResult.value.sunset)

            case "dusk":
                return formatTime(timesResult.value.dusk)

            case "dawn":
                return formatTime(timesResult.value.dawn)


            default:
                return ""
        }

    }))



    return {
        columns,
        ISODate,
        timesResult
    }
}
