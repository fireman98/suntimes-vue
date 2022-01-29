import { shallowMount } from '@vue/test-utils'
import SuntimesUtility from "@/classes/SuntimesUtility"
import { DateTime } from 'luxon'
import { SECOND } from "@/helpers/Timeconsts"
import SunCalc from "suncalc"


function measureTime (days = 1) {
    const startDate = DateTime.now()
    const endDate = DateTime.now().plus({ days: days })

    const beforeResult = new Date().getTime()
    const result = SuntimesUtility.calcDaysData(startDate, endDate)
    const afterResult = new Date().getTime()

    return afterResult - beforeResult
}

describe('calcDaysData', () => {
    it('returns empty Map when startDate > endDate', () => {
        const startDate = DateTime.now()
        const endDate = DateTime.now().plus({ days: -1 })

        expect(SuntimesUtility.calcDaysData(startDate, endDate)).toEqual(new Map())
    })

    it('returns 1 day if startDate === endDate', () => {
        const startDate = DateTime.now()
        const endDate = DateTime.now()

        const result = SuntimesUtility.calcDaysData(startDate, endDate)

        expect(result.size).toBe(1)
    })

    it('returns correct data for a day', () => {
        const startDate = DateTime.now()
        const endDate = DateTime.now()

        const result = SuntimesUtility.calcDaysData(startDate, endDate)
        const resultWithSunCalc = SunCalc.getTimes(DateTime.now().toJSDate(), 0, 0)

        expect(result.get(startDate.toISODate())).toEqual(resultWithSunCalc)
    })

    it('returns 31 days when date is from 2022-01-01 to 2022-01-31 (close interval)', () => {
        const startDate = DateTime.now().set({ year: 2022, month: 1, day: 1 })
        const endDate = DateTime.now().set({ year: 2022, month: 1, day: 31 })

        const result = SuntimesUtility.calcDaysData(startDate, endDate)

        expect(result.size).toEqual(31)
    })

    it('generates correct keyformats (iso date)', () => {
        const startDate = DateTime.now().set({ year: 2022, month: 1, day: 1 })
        const endDate = DateTime.now().set({ year: 2022, month: 1, day: 7 })

        const result = SuntimesUtility.calcDaysData(startDate, endDate)
        expect([...result.keys()]).toEqual([0, 1, 2, 3, 4, 5, 6].map(x => startDate.plus({ days: x }).toISODate()))
    })

    it('generates large number of days (measure time) (1000)', () => {
        expect(measureTime(1000)).toBeLessThan(300)
    })

    it('generates large number of days (measure time) (100 000)', () => {
        expect(measureTime(100000)).toBeLessThan(5 * SECOND)
    })
})
