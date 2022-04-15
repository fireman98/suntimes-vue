import SuntimesUtility from "@/classes/SuntimesUtility"
import { GetTimesResult } from "suncalc"

export interface SuntimesState {
    daysData: Map<string, GetTimesResult>
}

const state: SuntimesState = {
    /**
     * Stores Suntimes data, for days.
     * Results are cached, so components dont need to compute, only if data is missing
     */
    daysData: new Map(),
}


const actions = {

}

const mutations = {
    addToDaysData (state: SuntimesState, val: Map<string, GetTimesResult>) {
        val.forEach((value, key) => {
            state.daysData.set(key, value)
        })
    },

    emptyDaysData (state: SuntimesState) {
        state.daysData = new Map()
    },
}


export default {
    namespaced: true,
    state,
    actions,
    mutations
}