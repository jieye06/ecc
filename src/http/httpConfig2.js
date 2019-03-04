/* eslint-disable */
/**
 * Created by egoyau on 2018/1/9.
 */
/* eslint-disable */
import axios from 'axios'
import qs from 'qs' 
import { Message } from 'iview';

axios.defaults.timeout = 30000
// axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.BASE_URL
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    config.headers = {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'
    };
    if (config.method === 'post') {
        // 序列化
        config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事
    let code = res.data.responseCode
    // 获取数据流
    if (!code) {
        if (res.data.length) {
            return Promise.resolve(res)
        } else {
            return Promise.reject(res)
        }
    } else {
        // 通用请求
        switch (code) {
            case '100000':
                return Promise.resolve(res)
            case '99996':
                window.top.location.href = process.env.SESSION_INVALID_URL;
                return Promise.reject(res)
            default:
                return Promise.reject(res)
        }
    }
}, (error) => {
    let data = {
        data: {
            responseCode: '500000',
            message: '网络异常，请稍后再试'
        }
    }
    return Promise.reject(data)
})

// 返回一个Promise(发送get请求)
export function get(url, params) {
    return new Promise((resolve, reject) => {
        if (process.env.getBaseUrl) {
            axios.defaults.baseURL = process.env.getBaseUrl(params.url);
        }
        axios.get(url, params)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 返回一个Promise(发送post请求)
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response.data)
            }, err => {
                alert("已连接到对方网络 但返回异常")
                reject(err)
            })
            .catch((error) => {
                alert("未连接到对方网络")
                reject(error)
            })
    })
}
export default {
    doAxios: function(params, succ, fail) {
        // 设置url，一般用于开发环境
        if (process.env.getBaseUrl) {
            axios.defaults.baseURL = process.env.getBaseUrl(params.url);
        }

        // 调用axios，并返回promise对象
        return axios(params).then(res => {
            if (succ) {
                succ(res.data);
            }
            return Promise.resolve(res);
        }, err => {
            if (fail) {
                fail(err);
            } else {
                // 默认异常弹出错误信息，也可以定义fail覆盖此处默认异常消息弹窗
                Message.error(err.message);
            }
            // 抛出异常，各个页面可以继续处理或者忽略
            return Promise.reject(err);
        });
    },
    // 以json形式参数，发送post请求
    postJson: function (url, params, succ, fail) {
        return this.doAxios({
            method : 'post',
            url : url,
            data : JSON.stringify(params),
            headers : {
                'Content-Type': 'application/json;charset:utf-8;'
            }
        }, succ, fail);
    },
    post: function(url, params, succ, fail) {
        return this.doAxios({
            method : 'post',
            url : url,
            data : params,
            headers : {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }, succ, fail);
    },
}