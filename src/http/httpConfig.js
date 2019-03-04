/**
 * http工具类
 */
import axios from 'axios';
import qs from 'qs';
import { Message } from 'iview';

// 超时时间
axios.defaults.timeout = 30000;
// 基础地址
axios.defaults.baseURL = process.env.BASE_URL;

// 响应拦截器——返回状态判断
axios.interceptors.response.use((res) => {
    // 获取数据
    let code = res.data.responseCode;
    
    if (code) {
        // 通用处理
        switch (code) {
        case '100000':
            return Promise.resolve(res.data);
        // ecc session失效
        case '99996':
            window.top.location.href = process.env.SESSION_INVALID_URL;
            break;
        // etbc session失效
        // case '101002':
        //     window.top.location.href = process.env.SESSION_INVALID_URL;
        //     break;
        default:
            return Promise.reject(res.data);
        }
    } else {
        if (res.data) {
            return Promise.resolve(res.data);
        }
        return Promise.reject(res);
    }
}, (error) => {
    if (error.message) {
        return Promise.reject(error);
    } else {
        let data = {
            message: '网络异常，请稍后再试'
        };

        return Promise.reject(data);
    }
});

export default {
    // 内部公共方法
    doAxios: function(params, succ, fail) {
        // 设置url，一般用于开发环境
        if (process.env.getBaseUrl) {
            axios.defaults.baseURL = process.env.getBaseUrl(params.url);
        }

        // 调用axios，并返回promise对象
        return axios(params).then(res => {
            if (succ) {
                succ(res);
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
    // 发送get请求
    get: function (url, params, succ, fail) {
        return this.doAxios({
            method : 'get',
            url : url,
            params : params,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }, succ, fail);
    },
    // 以表单形式参数，发送post请求
    post: function(url, params, succ, fail) {
        return this.doAxios({
            method : 'post',
            url : url,
            data : qs.stringify(params, {allowDots: true}),
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }, succ, fail);
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
    upload: function (url, params, succ, fail) {
        return this.doAxios({
            method : 'post',
            url : url,
            data : params,
            headers : {
                'Content-Type': 'multipart/form-data'
            }
        }, succ, fail);
    }
}
