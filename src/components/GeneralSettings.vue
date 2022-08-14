<template>
    <div class="position-wrapper">
        <div class="mui-checkbox">
            <label>
                <input type="checkbox" v-model="useSkyEffect">
                SkyEffect background
            </label>
        </div>
        <button type="button" class="mui-btn mui-btn--secondary" @click="resetDefaults">
            Reset defaults
        </button>
        <button type="button" class="mui-btn mui-btn--secondary" @click="load">
            Cancel
        </button>
        <button type="button" class="mui-btn mui-btn--primary" @click="save">
            Save
        </button>
    </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, onUnmounted } from 'vue'


export default defineComponent({
    name: "GeneralSettings",
    emits: {
        close () { return true }
    },
    setup (_props, context) {
        const settingsStore = useSettingsStore()
        const { useSkyEffect } = storeToRefs(settingsStore)

        const load = async () => {
            await settingsStore.loadFromLocalStorage()
            context.emit('close')
        }

        const resetDefaults = async () => {
            settingsStore.reset()
            context.emit('close')


        }

        const save = async () => {
            await settingsStore.saveToLocalStorage()
            context.emit('close')

        }

        onUnmounted(async () => {
            await load()
        })

        return {
            useSkyEffect,
            load,
            resetDefaults,
            save
        }
    }
})
</script>
<style lang="scss" scoped>
@use "@/scss/init/variables" as *;

.position {
    &-wrapper {
        display: flex;
        flex-direction: column;
    }
}
</style>