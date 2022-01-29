import SunCalc from "suncalc"
import { GetTimesResult } from "suncalc"
import { DateTime } from "luxon"


function calcDaysData (from: DateTime, to: DateTime): Map<string, GetTimesResult> {
    // Set start, end to middle of the day
    // to avoid day change due to timezone
    from.set({ hour: 12, minute: 0 })
    to.set({ hour: 12, minute: 0 })

    const o = new Map()

    while (from <= to) {
        o.set(from.toISODate(), SunCalc.getTimes(from.toJSDate(), 0, 0))

        from = from.plus({ days: 1 })
    }

    return o

}


export default {
    calcDaysData,
}