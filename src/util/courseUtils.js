const dayMap = new Map([[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [7, '日']])

function getScheduleTimeString(schedule) {
    return `星期${dayMap.get(schedule.ssDayOfWeek)} 第 ${schedule.ssStartTime < 10 ? `0${schedule.ssStartTime}` : schedule.ssStartTime} ~ ${schedule.ssEndTime < 10 ? `0${schedule.ssEndTime}` : schedule.ssEndTime} 节 ${schedule.ssRoom}`
}

function getCourseMonitorStatus(sisCourse) {
    if (!sisCourse.scNeedMonitor)
        return '未督导'
    if (null == sisCourse.suId)
        return '未领取'
    return `督导中 ${sisCourse.monitor.suName} ${sisCourse.monitor.suId}`
}

export default {
    getCourseMonitorStatus,
    getScheduleTimeString
}