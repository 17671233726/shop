import { request } from './request'
//获取分类的数据列表
export function getCateList(params) {
    return request({
        url: 'categories',
        params
    })
}

//获取父级分类列表
export function getParentCateList(type) {
    return request({
        url: 'categories',
        params: {
            type
        }
    })
}

//添加分类
export function addCate(params) {
    return request({
        url: 'categories',
        method: 'post',
        data: params
    })
}

//编辑分类
export function editCate(id, cat_name) {
    return request({
        url: `categories/${id}`,
        method: 'put',
        data: {
            cat_name
        }
    })
}

//删除分类
export function deleteCate(id) {
    return request({
        url: `categories/${id}`,
        method: 'delete',
    })
}