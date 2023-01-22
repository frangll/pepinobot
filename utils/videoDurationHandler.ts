const { max_video_duration_seconds } = require('../config/main.json')

export function checkVideoDuration(duration: number): boolean {
    return duration > max_video_duration_seconds
}