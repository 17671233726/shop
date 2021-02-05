import axios from 'axios'
export function request(config) {
    const instance = axios.create({
        baseURL: 'http://www.ysqorz.top:8888/api/private/v1/',
        timeout: 5000
    })
    return instance(config)
}