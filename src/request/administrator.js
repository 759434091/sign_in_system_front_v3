import axios from "./axiosConfig"

async function getCourse(hasMonitor, needMonitor, page,
                         sdId, scGrade, scName) {
    return axios.get('/courses', {
        params: {
            getType: 'administrator',
            hasMonitor,
            needMonitor,
            page,
            sdId: '' === sdId ? null : sdId,
            scGrade: '' === scGrade ? null : scGrade,
            scName: '' === scName ? null : scName
        }
    })
}

async function getSupervision(scId) {
    return await axios.get(`/courses/${scId}/supervisions`)
}

async function getDepartments(sdName) {
    return await axios.get('/departments', {
        params: {
            sdName: '' === sdName.trim() ? '' : sdName
        }
    })
}

async function modifyScNeedMonitor(scId, scNeedMonitor) {
    return await axios.put(`/courses/${scId}/sc-need-monitor`, {
        scNeedMonitor
    })
}

export default {
    getCourse,
    getSupervision,
    getDepartments,
    modifyScNeedMonitor
}