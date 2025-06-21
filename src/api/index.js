import axios from 'axios'
import qs from 'qs';
import {Message} from "element-ui";
import router from '@/router';
import CONFIG, {TOKEN_KEY, BASE_URL} from "./config";
import Cookies from 'js-cookie';

const {timeout, headers} = CONFIG

// const isFunction = (fn) => typeof fn === 'function';

const service = axios.create({
    baseURL: BASE_URL,
    timeout: timeout,
    headers: {
        ...headers
    }
})


// MessageBox.confirm(`此操作将永久删除标签“”, 是否继续?`, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
// }).then().catch(() => {
// });

// MessageBox.alert('接口不存在！', '404', {
//     confirmButtonText: '关闭',
//     callback: action => {}
// });

service.interceptors.request.use(config => {
    // config.url = BASE_URL + config.url
    return config
}, error => {
    return Promise.reject(error);
})

const responseHandler = (code, response) => {
    switch (code) {
        case 404:
            // Message.error('接口不存在！', '404', {
            //     confirmButtonText: '关闭',
            //     callback: action => {}
            // });
            console.log('404：接口不存在！')
            break;
        case 402:
            router.push({path: '/login'})
            break;
        case 500:
        case 100:
            Message.error((response.data.msg || response.data.message || '服务器出小差了'), '警告', {
                confirmButtonText: '关闭',
                callback: action => {}
            });
            break;
        case 1000:
            router.push({path: '/login'})
            break;
        default:
            break;
    }
}

service.interceptors.response.use(
    response => {
        // console.log('response:')
        // console.log(response)
        responseHandler(response.data && response.data.code, response)
        return response
    },
    error => {
        // console.log('error:')
        // console.log(error.response)
        if(error.response) {
            return responseHandler(error.response.status, error.response)
        } else {
            Message.error('未知异常，请联系管理员！', '警告', {
                confirmButtonText: '关闭',
                callback: action => {}
            });
        }
        return error.data;
    }
)

export default (
    type = 'get',
    url,
    data = {},
    baseUrl = '',
    isForm = 1,
    dataType = 'json'
) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject();
        }
        if(baseUrl) {
            service.defaults.baseURL = baseUrl
        } else {
            if(url.indexOf('http') != -1) {
                service.defaults.baseURL = ''
            } else {
                service.defaults.baseURL = BASE_URL
            }
        }

        let options = {}
        options.method = type;
        options.url = url
        options.headers = {};
        options.headers['Content-type'] = "application/json;charset=UTF-8";
        options.headers[TOKEN_KEY] = Cookies.get(TOKEN_KEY);
        options.headers['Authorization'] = Cookies.get(TOKEN_KEY);

        if (type.toUpperCase() === 'GET') {
            options.params = data;
        } else {
            options.data = data;
            if (isForm === 2) {
                options.headers['Content-type'] = "application/x-www-form-urlencoded;charset=UTF-8"
                options.data = qs.stringify(options.data);
            } else if (dataType === 'formData') {
                options.headers['Content-type'] = "multipart/form-data"
            }
        }

        service(options).then((response) => {
            if (!response) response.data.resp_code = 400;
            const res = response.data;
            resolve(res);
        }).catch((err) => {
            resolve(err)
        });
    })
}

export const download = function (url, params) {
    service.defaults.headers[TOKEN_KEY] = Cookies.set(TOKEN_KEY);
    return new Promise((resolve, reject) => {
        service.get(url, {
            params: params,
            responseType: 'blob',
        }).then(res => {
            let url = window.URL.createObjectURL(res.data)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('id', 'downloadLink')
            link.setAttribute('download', params.title)
            document.body.appendChild(link)
            link.click()
            // 删除添加的a链接
            let objLink = document.getElementById('downloadLink')
            document.body.removeChild(objLink)
            // 释放内存
            window.URL.revokeOjbectURL(url)
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}

export const downloadFile = function (url, params = {}, method = 'get') {
    service.defaults.headers[TOKEN_KEY] = Cookies.get(TOKEN_KEY);
    service.defaults.headers['Content-type'] = 'application/json;charset=UTF-8';
    service.defaults.headers['Authorization'] = Cookies.get(TOKEN_KEY);
    return new Promise((resolve, reject) => {
        service({
            method: method,
            url,
            params: {
                ...params
            },
            responseType: 'blob'
        }).then(res => {
            let headers = res.headers
            var blob = new Blob([res.data], {
                type: headers['Content-Type']
            });
            var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
            var result = patt.exec(contentDisposition);
            var filename = params.downloadName ? params.downloadName : result[1];
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.style.display = 'none';
            downloadElement.href = href;
            downloadElement.download = decodeURIComponent(filename); //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            return resolve(res.data)
        }).catch(err => {
            return reject(err.data)
        })
    })
}

export const link = (url) => {
    window.location.href = BASE_URL + url
}
