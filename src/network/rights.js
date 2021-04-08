import { request } from './request'
export function getRightsList() {  //获取权限列表
    return request({
        url: 'rights/list'
    })
}

export function getTreeRightsList() {  //获取树形权限列表
    return request({
        url: 'rights/tree'
    })
}

export function getRolesList() {  //获取角色列表
    return request({
        url: 'roles'
    })
}

export function addRole(roleInfo) {  //添加角色
    return request({
        url: 'roles',
        method: 'post',
        data: roleInfo
    })
}

export function removeRight(roleId, rightId) {  //根据角色id删除对应权限
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete',
    })
}


export function allotRights(roleId, rids) {  //分配权限
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids
        }
    })
}