import axios from "./axiosConfig"

export async function getCourse(page, pageSize, hasMonitor, needMonitor, sdId, scGrade, scId, scName) {
    return axios.get('/courses', {
        params: {
            getType: 'administrator',
            hasMonitor,
            needMonitor,
            page,
            pageSize,
            sdId: '' === sdId ? null : sdId,
            scGrade: '' === scGrade ? null : scGrade,
            scId: '' === scId ? null : scId,
            scName: '' === scName ? null : scName
        }
    })
}

export async function batchSupervisions(monitorStatus, hasMonitor, needMonitor,
                                        sdId, scGrade, scId, scName) {
    return axios.put('/courses/sc-need-monitor', null, {
        params: {
            monitorStatus,
            hasMonitor,
            needMonitor,
            sdId: '' === sdId ? null : sdId,
            scGrade: '' === scGrade ? null : scGrade,
            scId: '' === scId ? null : scId,
            scName: '' === scName ? null : scName
        }
    })
}

export async function batchSelectionSupervisions(monitorStatus, scIdList) {
    return axios.put('/courses/sc-need-monitor', scIdList, {
        params: {
            monitorStatus
        }
    })
}

export async function getSupervision(scId) {
    return await axios.get(`/courses/${scId}/supervisions`)
}

export async function getDepartments(sdName) {
    return await axios.get('/departments', {
        params: {
            sdName: '' === sdName.trim() ? '' : sdName
        }
    })
}

export async function modifyScNeedMonitor(scId, scNeedMonitor) {
    return await axios.put(`/courses/${scId}/sc-need-monitor`, {
        scNeedMonitor
    })
}

export default {
    getCourse,
    batchSupervisions,
    getSupervision,
    getDepartments,
    modifyScNeedMonitor,
    batchSelectionSupervisions
}