import axios from 'axios'
export function request(config) {
    const instance = axios.create({
        baseURL: 'http://www.ysqorz.top:8888/api/private/v1/',
        timeout: 5000
    })
    instance.interceptors.request.use(con => {
        con.headers.Authorization = window.sessionStorage.getItem('token');
        return con
    }, err => {

    });
    instance.interceptors.response.use(res => {
        return res.data
    }, err => { })
    return instance(config)
}