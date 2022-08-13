<template>
    <div class="times-parameters">
        <input type="date" v-model="fromAsISODate">
        <select :value="viewType" @change="$emit('update:viewType', $event?.target?.value)">
            <option v-for="suntimesViewTypeValues of SuntimesViewTypeValues" :value="suntimesViewTypeValues"
                :key="suntimesViewTypeValues">
                {{ suntimesViewTypeValues }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import { SuntimesViewType } from '@/interfaces/Suntimes'
import { DateTime } from 'luxon'
import { computed, defineComponent, PropType, toRef, toRefs } from 'vue'


export default defineComponent({
    props: {
        from: {
            required: true,
            type: DateTime
        },

        viewType: {
            required: true,
            type: String as PropType<SuntimesViewType>
        }
    },

    emits: {
        'update:from' (payload: DateTime) {
            return payload instanceof DateTime
        },
        'update:viewType' (payload: SuntimesViewType) {
            return (Object.values(SuntimesViewType).includes(payload))
        }
    },

    setup (props, context) {
        const { from, viewType } = toRefs(props)

        const SuntimesViewTypeValues = computed(() => Object.values(SuntimesViewType))

        const fromAsISODate = computed({
            get () {
                return from.value.toISODate()
            },

            set (val) {
                context.emit("update:from", DateTime.fromISO(val))
            }
        })

        return {
            SuntimesViewTypeValues,
            fromAsISODate
        }
    }
})

</script>