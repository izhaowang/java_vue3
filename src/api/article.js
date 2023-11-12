import request from "@/utils/request.js";

export default {
    getArticleCategory: () => {
        return request.get('/category')
    },
    submitArticleCategory: data => {
        console.log(data);
        return request.post('/category/add', data)
    },
    // 
    editArticleCategory: data => {
        return request.put('/category', data)
    },
    // querystring类型
    deleatAtricile: data => {
        console.log(data);
        return request.delete('/category', { params: data })
    },
    // 获取文章列表
    getArticle: (data) => {
        return request.get('/article', {
            params: data
        })
    },

    // 新增文章
    addArticle: (data) => {
        return request.post('/article', data)
    }

}