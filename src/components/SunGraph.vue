<template>
    <div class="sun-graph">
        <canvas ref="canvas" width="600" height="300"></canvas>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue'
import { DateTime } from 'luxon'
import { Chart, ChartConfiguration } from 'chart.js'
import { LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation } from "chart.js"



import { getSunPathForDay } from "@/classes/SuntimesUtility"
import { formatTime } from '@/helpers/General'

Chart.register(LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation)


export default defineComponent({
    name: "SunGraph",
    props: {
        date: {
            type: Object as PropType<DateTime>,
            required: true,
        },
    },
    setup (props) {
        const { date } = toRefs(props)


        const dayData = computed(() => {
            return getSunPathForDay(date.value)
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
                            tension: 0.4,
                            backgroundColor: 'rgba(255, 201, 78, 0.4)',
                            borderColor: [
                                '#FFC94E',
                            ],
                            borderWidth: 5,
                            pointRadius: 0,
                            pointHoverRadius: 12,
                            fill: true,
                        },
                    ]
                },
                options: {
                    animation: false,
                    parsing: false,

                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        /* decimation: {
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
                            max: 90
                        }
                    },
                    responsive: true
                },
            }
        })

        const canvas = ref<HTMLCanvasElement | null>(null)

        watch([dayData], (newVal) => {
            for (let i = 0; i < dayData.value.length; i++) {
                labelsForChart[i] = formatTime(newVal[0][i].time)
                altitudes[i] = { x: i, y: newVal[0][i].altitude }
            }

            if (chart)
                chart.update()
        }, { immediate: true })

        onMounted(() => {
            watch([config], () => {
                if (!canvas.value)
                    return
                if (chart) {
                    /*chart.data.datasets.forEach((_d, i: number) => { // Labels must be reassigned to apply
                        chart!.data.datasets[i].label = config.value.data.datasets[i].label
                    })*/
                    chart.update()
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
            dayData
        }

    }
})
</script>

<style style="scss" scoped>
</style>