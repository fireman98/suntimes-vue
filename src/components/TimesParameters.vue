<template>
    <div class="times-parameters">
        <div class="mui-textfield date-input">
            <input type="date" v-model="fromAsISODate" aria-label="date">
            <button class="image-icon-wrapper time-selector__button" @click="goLeft" title="previous">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="image-icon-wrapper time-selector__button" @click="goRight" title="next">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="mui-select">
            <select :value="viewType" @change="$emit('update:viewType', $event?.target?.value)">
                <option v-for="suntimesViewTypeValues of SuntimesViewTypeValues" :value="suntimesViewTypeValues"
                    :key="suntimesViewTypeValues">
                    {{ suntimesViewTypeValues }}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import { SuntimesViewType } from '@/interfaces/Suntimes'
import { DateTime } from 'luxon'
import { computed, defineComponent, PropType, toRefs } from 'vue'


export default defineComponent({
    props: {
        from: {
            required: true,
            type: Object as PropType<DateTime>
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
                context.emit("update:from", DateTime.fromISO(val).startOf('month'))
            }
        })

        const goLeft = () => {
            fromAsISODate.value = from.value.plus({ month: -1 }).toISODate()
        }

        const goRight = () => {
            fromAsISODate.value = from.value.plus({ month: 1 }).toISODate()
        }

        return {
            SuntimesViewTypeValues,
            fromAsISODate,
            goLeft,
            goRight
        }
    }
})

</script>
<style lang="scss" scoped>
.date-input {
    display: flex;
}

.time-selector__button {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 2rem;
}
</style>