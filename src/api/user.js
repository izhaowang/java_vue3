import request from '@/utils/request.js';

//
export default {
    userRegister: data => {
        console.log(data);
        const params = new URLSearchParams();
        for (let key in data) {
            params.append(key, data[key])
        }
        console.log(params);
        return request.post('/user/register', params)
    },
    userLogin: data => {
        console.log(data);
        const params = new URLSearchParams();
        for (let key in data) {
            params.append(key, data[key])
        }
        console.log(params);
        return request.post('/user/login', params)
    },
    userInfo: () => {
        return request.get('/user/userInfo')
    },
    editUserInfo: (data) => {
        return request.put("/user/update", data)
    },
    updataAvatarServer: (data) => { // queryString
        const params = new URLSearchParams();
        params.append("avatarUrl", data)
        return request.patch("/user/updateAvatar", params)
    },
    updatePwdServer: (data) => {
        return request.patch("/user/updatePwd", data)
    }

}