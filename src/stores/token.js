import { defineStore } from 'pinia'
import { ref } from 'vue'
/**
 * 第一个参数是 名字，唯一
 * 第二个参数是函数， 进行getter 和 setter
 */
export const useTokenStore = defineStore('token', () => {
    // 响应式变量
    const token = ref('');
    const setToken = newToken => {
        token.value = newToken
    }
    const removeToken = () => {
        token.value = ''
    }
    return {
        token,
        setToken,
        removeToken
    }
},
    {
        persist: true
    }

)