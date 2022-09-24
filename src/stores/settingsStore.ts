import { defineStore } from "pinia"
import localforage from "localforage"

const db = localforage.createInstance({
    name: "storage"
})

interface SettingsState {
    useSkyEffect: boolean,
    lng: number,
    lat: number
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        useSkyEffect: true,
        lng: 0,
        lat: 0,
    }),
    getters: {
    },

    actions: {
        async saveToLocalStorage () {
            await db.setItem('useSkyEffect', this.useSkyEffect)
            await db.setItem('lng', this.lng)
            await db.setItem('lat', this.lat)


        },

        async loadFromLocalStorage () {
            this.useSkyEffect = await db.getItem('useSkyEffect') ?? true
            this.lng = await db.getItem('lng') ?? 0
            this.lat = await db.getItem('lat') ?? 0
        },

        reset () {
            this.$reset()
            this.saveToLocalStorage()
        }
    },

})