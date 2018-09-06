import axios from "./axiosConfig"

async function getCourseTable() {
    return await axios.get('/courses', {
        params: {
            getType: 'monitor'
        }
    })
}

export default {
    getCourseTable
}