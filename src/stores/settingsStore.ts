import { defineStore } from "pinia"
import localforage from "localforage"

const db = localforage.createInstance({
    name: "storage"
})

interface SettingsState {
    useSkyEffect: boolean
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => ({
        useSkyEffect: true
    }),
    getters: {
    },

    actions: {
        async saveToLocalStorage () {
            await db.setItem('useSkyEffect', this.useSkyEffect)
        },

        async loadFromLocalStorage () {
            this.useSkyEffect = await db.getItem('useSkyEffect') ?? true
        },

        reset () {
            this.$reset()
            this.saveToLocalStorage()
        }
    },

})