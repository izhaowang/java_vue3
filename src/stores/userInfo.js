import { defineStore } from "pinia";
import { reactive } from "vue";
export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo = reactive({});
    const setUserInfo = newVal => {
        console.log(newVal);
        Object.assign(userInfo, newVal);
    }
    const removeUserInfo = () => {
        Object.keys(userInfo).forEach(key => {
            userInfo[key] = ''
        })
    }
    return {
        userInfo,
        setUserInfo,
        removeUserInfo
    }
}, {
    persist: true
})