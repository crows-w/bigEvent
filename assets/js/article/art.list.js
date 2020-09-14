$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = add_zero(dt.getFullYear())
        var m = add_zero(dt.getMonth() + 1)
        var d = add_zero(dt.getDate())

        var hh = add_zero(dt.getHours())
        var mm = add_zero(dt.getMinutes())
        var ss = add_zero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补充零函数
    function add_zero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，请求数据的时候把它提交到服务器
    var q = {
        pagenum: 1,     // 页码值
        pagesize: 2,    // 每页显示多少条数据
        cate_id: '',    // 文章分类的 Id
        state: ''       // 文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板
                var htmlStr = template('cate_id', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选项中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    // 渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',                        // 指向存放分页的容器
            count: total,                           // 数据总数。
            limit: q.pagesize,                      // 每页显示的条数
            curr: q.pagenum,                        // 每页条数的选择项。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {           // 分页发生切换触发 
                // 只要调用layer.render() 就会触发
                // console.log(obj.curr);           // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit);          // 得到每页显示的条数 obj.limit
                q.pagenum = obj.curr                // 把的得到的当前页赋值给 q.pagenum
                q.pagesize = obj.limit              // 把得到的每页显示的条数赋值给 q.pagesize
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成后，需要判断这一页中，是否还有剩余的数据
                    // 如果没有生育的数据了，则让页码值 -1 之后
                    // 在重新调用 initTable方法
                    if (len === 1) {
                        // 页码值最小必须是 1 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index);
                }
            })
        });
    })
})
