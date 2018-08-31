import axios from 'axios';

axios.defaults.baseURL = 'https://api.xsix103.cn/sign_in_system/v3/'

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

async function getCourseTable() {
    return await axios.get("/courses", {
        params: {
            getType: 'student'
        }
    })
}

export default {
    setAuthorizationValue,
    getToken,
    getWeek,
    getCourseTable
}