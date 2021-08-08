import { request } from './request'
export function getReport(validateObj) {
    return request({
        url: '/reports/type/1',
    })
}