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

export default {
    axios: axios,
    setAuthorizationValue,
    getToken,
    getWeek,
    student,
    administrator
}