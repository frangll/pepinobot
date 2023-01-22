export function secondsToFormat(seconds: number) {
    let time = new Date(seconds * 1000).toISOString()
    return seconds < 3600 ? time.substring(14, 19) : time.substring(11, 19)
}