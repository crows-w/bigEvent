// 每次调用 $.get() $.ajax() $.post() 都会先调用 ajaxPrefilter 函数
// 这个函数中，可以拿到我们给Ajax提供配置的对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 统一有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 不论成功还是失败都会调用 complete 回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空 token
            localStorage.removeItem('token')
            // 强制跳转登录页面
            location.href = '/login.html'
        }
    }
})