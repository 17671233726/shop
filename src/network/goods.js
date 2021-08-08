import { request } from './request'
//获取分类的数据列表
export function getCateList(params = 3) {
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

// -------------------分类参数--------------------
// 获取分类参数列表
export function getCateParamsList(id, sel) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'get',
        params: {
            sel
        }
    })
}

// 添加分类属性
export function addCateParams(id, attr_name, attr_sel) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'post',
        data: {
            attr_name,
            attr_sel
        }
    })
}

//根据 ID 查询参数
export function getIdFromParam(id, attrId, attr_sel) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        method: 'get',
        params: {
            attr_sel
        }
    })
}

//获取商品列表

export function getGoodsList(queryInfo) {   //queryInfo参数query, pagenum, pagesize
    return request({
        url: `goods`,
        method: 'get',
        params:queryInfo
    })
}

//删除商品
export function deleteGoodsById(id) {   //queryInfo参数query, pagenum, pagesize
    return request({
        url: `goods/${id}`,
        method: 'delete',
    })
}

//添加商品
export function addGoods(goodsInfo) { 
    return request({
        url: 'goods',
        method:'post',
        data: goodsInfo
    })
}



