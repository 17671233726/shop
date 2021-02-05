import { request } from './request'
export function loginValidate(validateObj) {
    return request({
        url: '/login',
        method: 'post',
        data: validateObj
    })
}