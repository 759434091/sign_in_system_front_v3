import axios from './axiosConfig'
import student from './student'
import administrator from './administrator'

function setAuthorizationValue(token) {
    axios.defaults.headers.Authorization = `Bearer ${token}`
}

async function getToken(loginData) {
    const formData = new FormData()
    formData.append('suId', loginData.suId)
    formData.append('suPassword', loginData.suPassword)
    return await axios.post("/tokens", formData)
}

async function getWeek() {
    return await axios.get("/week")
}

async function modifyPassword(suId, oldPassword, newPassword) {
    const formData = new FormData()
    formData.append('oldPassword', oldPassword)
    formData.append('newPassword', newPassword)
    return await axios.post(`/users/${suId}`, formData)
}

export default {
    axios: axios,
    setAuthorizationValue,
    getToken,
    getWeek,
    modifyPassword,
    student,
    administrator
}