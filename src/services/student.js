/* eslint-disable  */
import axios from 'axios';

const BASE_URL = 'https://613cb968270b96001798b246.mockapi.io/student'

class StudentService {
    search() {
        return axios({
            url: BASE_URL
        }).then(res => res.data)
    }

    getById(id) {
        return axios({
            url: `${BASE_URL}/${id}`
        }).then(res => res.data)
    }

    create(data) {
        return axios({
            data,
            method: 'POST',
            url: BASE_URL,
        }).then(res => res.data)
    }

    update(id, data) {
        return axios({
            data,
            method: 'PUT',
            url: `${BASE_URL}/${id}`
        }).then(res => res.data)
    }

    delete(id) {
        return axios({
            url: `${BASE_URL}/${id}`,
            method: "DELETE"
        }).then(res => res.data)
    }
}

export const studentService = new StudentService();