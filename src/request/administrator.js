import axios from "./axiosConfig"

async function getCourse(hasMonitor, needMonitor, page) {
    return axios.get('/courses', {
        params: {
            getType: 'administrator',
            hasMonitor,
            needMonitor,
            page
        }
    })
}

async function getSupervision(scId) {
    return await axios.get(`/courses/${scId}/supervisions`)
}

export default {
    getCourse,
    getSupervision
}