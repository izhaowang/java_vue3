//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/stores/token';
import router from "@/router"
const baseURL = '/api';
const instance = axios.create({ baseURL })

instance.interceptors.request.use(
    config => {//请求钱
        // 
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            // 由token 的话就添加请求头
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    err => { // 失败时
        Promise.reject(err)
    }
)

//添加响应拦截器
instance.interceptors.response.use(

    result => {
        if (result.data.code === 0) {
            return result.data
        };

        ElMessage.error(result.data.message ? result.data.message : "服务异常")
        return Promise.reject(result.data)
    },
    err => {

        if (err.response.status === 401) { // 表示未登录
            ElMessage.error('请先登录');
            router.push('/login')
        } else {
            ElMessage.error('服务异常');
        }

        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;