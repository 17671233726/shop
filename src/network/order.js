import { request } from './request'
export function getOrderList(queryInfo) { 
    return request({
        url: 'orders',
        params:queryInfo
    })
}

//查看物流信息
export function getProcess(id='1106975712662') { 
    return request({
        url: `/kuaidi/${id}`,
    })
}