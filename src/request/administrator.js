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

async function getStudents(page, pageSize, suId, suName, orderByCozLackNum) {
    return await axios.get('/students', {
        params: {
            page,
            pageSize,
            suId: '' === suId ? null : suId,
            suName: '' === suName ? null : suName,
            orderByCozLackNum
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

async function modifyScheduleLocation(ssId, slId) {
    return await axios.put(`/schedules/${ssId}/locations/${slId}`)
}

async function getProgress(key) {
    return await axios.get(`/progress/${key}`)
}

async function importCozInfo(formData) {
    return await axios.post('/courses/import', formData)
}

async function importStuInfo(formData) {
    return await axios.post('/students/import', formData)
}

async function getStuSignIns(suId) {
    return await axios.get(`/users/${suId}/signIns`)
}

async function modifyLocation(slId, sisLocation) {
    return await axios.put(`/locations/${slId}`, sisLocation)
}

async function deleteLocation(slId) {
    return await axios.delete(`/locations/${slId}`)
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
    getSignIns,
    modifyScheduleLocation,
    getProgress,
    importCozInfo,
    importStuInfo,
    getStuSignIns,
    modifyLocation,
    deleteLocation
}