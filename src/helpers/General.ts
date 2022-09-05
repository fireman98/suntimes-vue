export function radians_to_degrees (radians: number) {
    const pi = Math.PI
    return radians * (180 / pi)
}

export function formatTime (date: Date) {
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute
        } `
}