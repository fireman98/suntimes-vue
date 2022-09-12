<template>
    <div class="sun-graph">
        <canvas ref="canvas" width="600" height="300"></canvas>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue'
import { DateTime } from 'luxon'
import { ActiveElement, Chart, ChartConfiguration } from 'chart.js'
import { LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation } from "chart.js"
import Suncalc from "suncalc"


import SuntimesUtility, { getSunPathForDay } from "@/classes/SuntimesUtility"
import { formatTime, debounce } from '@/helpers/General'
import { useSettingsStore } from '@/stores/settingsStore'
import { storeToRefs } from 'pinia'

Chart.register(LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation)


export default defineComponent({
    name: "SunGraph",
    props: {
        date: {
            type: Object as PropType<DateTime>,
            required: true,
        },

        activePoint: {
            type: Number
        },

        labelColor: {
            type: String,
            default: "#ffffff"
        }
    },
    setup (props) {
        const { date, activePoint, labelColor } = toRefs(props)

        const settingsStore = useSettingsStore()
        const { lng, lat } = storeToRefs(settingsStore)


        const dayData = computed(() => {
            return getSunPathForDay(date.value)
        })

        const dayTimes = computed(() => {
            return SuntimesUtility.transformGetTimesResultDatesToLuxon(Suncalc.getTimes(date.value.toJSDate(), lat.value, lng.value))
        })

        const labelsForChart: Array<string> = reactive([])
        const altitudes: Array<{ x: number, y: number }> = reactive([])


        let chart: Chart | null = null
        const config = computed<ChartConfiguration>(() => {
            return {
                type: 'line',
                data: {
                    labels: labelsForChart,
                    datasets: [
                        {
                            label: 'Sun',
                            data: altitudes,
                            tension: false,
                            backgroundColor: 'rgba(255, 201, 78, 0.4)',
                            borderColor: [
                                '#FFC94E',
                            ],
                            borderWidth: 5,
                            pointRadius: (element: ActiveElement) => {
                                return [activePoint.value].includes(element.index) ? 8 : 0
                            },
                            segment: {
                                borderColor: element => {
                                    return element.p0.parsed.x > (activePoint.value || 0) ? 'rgba(2, 1, 85, 0.4)' : 'rgba(255, 201, 78, 0.4)'
                                },
                                backgroundColor: element => {
                                    return element.p0.parsed.y < 0 ? 'rgba(2, 1, 85, 0.4)' : 'rgba(255, 201, 78, 0.4)'
                                },
                                //borderDash: ctx => skipped(ctx, [6, 6]),
                            },
                            pointHoverRadius: 12,
                            fill: true,
                            spanGaps: true,
                        },
                    ]
                },
                options: {
                    //animation: false,
                    parsing: false,
                    spanGaps: true,

                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        /*decimation: {
                            enabled: false,
                            algorithm: 'min-max',
                        },*/
                        legend: {
                            display: true,
                        },
                        tooltip: {
                            enabled: true,
                            mode: "index",
                            callbacks: {
                                label: (input) => {
                                    return `Altitude ${input.parsed.y.toFixed(2)} \n Azimuth ${dayData.value[input.parsed.x].azimuth.toFixed(2)}`
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: -90,
                            max: 90,

                            ticks: {
                                color: labelColor.value,
                            }
                        },

                        x: {
                            ticks: {
                                color: labelColor.value,
                            }
                        }


                    },
                    responsive: true
                },
            }
        })

        const canvas = ref<HTMLCanvasElement | null>(null)

        const updateChart = debounce(() => {
            if (!chart)
                return

            chart.update()
        }, 500)

        watch([dayData], (newVal) => {
            for (let i = 0; i < dayData.value.length; i++) {
                labelsForChart[i] = formatTime(newVal[0][i].time)
                altitudes[i] = { x: i, y: newVal[0][i].altitude }
            }

            updateChart()
        }, { immediate: true })

        watch([labelColor], (newVal) => { // Update label colors
            if (!chart)
                return

            const xTicks = chart.options.scales?.x?.ticks
            const yTicks = chart.options.scales?.y?.ticks

            if (xTicks)
                xTicks.color = newVal
            if (yTicks)
                yTicks.color = newVal


            updateChart()

        })

        onMounted(() => {
            watch([config, activePoint], () => {
                if (!canvas.value)
                    return
                if (chart) {
                    /*chart.data.datasets.forEach((_d, i: number) => { // Labels must be reassigned to apply
                        chart!.data.datasets[i].label = config.value.data.datasets[i].label
                    })*/
                    updateChart()
                }
                else
                    chart = new Chart(canvas.value, config.value)

            }, { immediate: true })
        })

        return {
            canvas,
            altitudes,
            chart,
            config,
            dayData,
            dayTimes
        }

    }
})
</script>

<style style="scss" scoped>

</style>