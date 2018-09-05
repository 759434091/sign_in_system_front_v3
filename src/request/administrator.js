import axios from "./axiosConfig"

async function getCourse(page, pageSize, hasMonitor, needMonitor, sdId, scGrade, scId, scName) {
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

async function batchSupervisions(monitorStatus, hasMonitor, needMonitor,
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

async function batchSelectionSupervisions(monitorStatus, scIdList) {
    return axios.put('/courses/sc-need-monitor', scIdList, {
        params: {
            monitorStatus
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

async function getMonitors(page, pageSize, suId, suName, ordByLackNum) {
    return await axios.get('/monitors', {
        params: {
            page,
            pageSize,
            suId: '' === suId ? null : suId,
            suName: '' === suName ? null : suName,
            ordByLackNum
        }
    })
}

async function grantMonitor(suId) {
    return await axios.post(`/monitors/${suId}`)
}

async function revokeMonitor(suId) {
    return await axios.delete(`/monitors/${suId}`)
}

async function getStudents(page, pageSize, suId, suName) {
    return await axios.get('/students', {
        params: {
            page,
            pageSize,
            suId: '' === suId ? null : suId,
            suName: '' === suName ? null : suName
        }
    })
}

async function createSignIn(ssId) {
    return await axios.post(`/schedules/${ssId}/signIns`)
}

async function getSignIns(scId) {
    return await axios.get(`/courses/${scId}/signIns`, {
        params: {
            queryType: 'administrator'
        }
    })
}

export default {
    getCourse,
    getStudents,
    batchSupervisions,
    getSupervision,
    getDepartments,
    modifyScNeedMonitor,
    batchSelectionSupervisions,
    getMonitors,
    grantMonitor,
    revokeMonitor,
    createSignIn,
    getSignIns
}