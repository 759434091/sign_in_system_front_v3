import axios from "./axiosConfig"

async function getCourseTable() {
    return await axios.get('/courses', {
        params: {
            getType: 'monitor'
        }
    })
}

async function getMonitorPool(page, pageSize) {
    return await axios.get('/courses', {
        params: {
            getType: 'monitor',
            page,
            pageSize,
            needMonitor: true,
            hasMonitor: false
        }
    })
}

async function receiveCourse(scId) {
    return await axios.post(`/courses/${scId}/monitor`)
}

export default {
    getCourseTable,
    getMonitorPool,
    receiveCourse
}