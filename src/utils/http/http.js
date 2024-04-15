import instance from "./axios"


/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'get',
            params: params
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'post',
            data: params
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
 
 
/*
 *  put请求
 *  url:请求地址
 *  params:参数
 * */
export function put(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'put',
            data: params
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
 
/*
 *  put请求
 *  url:请求地址
 *  params:参数
 * */
export function putOne(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'put',
            params: params
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    });
}
 
export function del(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'delete',
            // data: params,
            params:params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}
/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}



export default {
    get,
    post,
    fileUpload,
    del,
    put,
    putOne
}