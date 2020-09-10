// 每次调用 $.get() $.ajax() $.post() 都会先调用 ajaxPrefilter 函数
// 这个函数中，可以拿到我们给Ajax提供配置的对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})