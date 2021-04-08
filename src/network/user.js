import { request } from './request'
export function getUsers(queryInfo) {
    return request({
        url: '/users',
        params: queryInfo
    })
}

export function changeUserState(uid, type) {
    return request({
        url: `users/${uid}/state/${type}`,
        method: 'put'
    })
}

export function addUser(userInfo) {
    return request({
        url: '/users',
        method: 'post',
        data: userInfo
    })
}

export function editUserInfo(info) {   //修改用户信息
    return request({
        url: '/users/' + info.id,
        method: 'put',
        data: {
            email: info.email,
            mobile: info.mobile
        }
    })
}

export function removeUser(id) {   //删除用户
    return request({
        url: '/users/' + id,
        method: 'delete',
    })
}

export function getRolesList() {   //获取角色列表
    return request({
        url: 'roles'
    })
}

export function setUserRole(id, rid) { //分配用户角色
    return request({
        url: `users/${id}/role`,
        data: {
            rid
        },
        method: 'put'
    })
}