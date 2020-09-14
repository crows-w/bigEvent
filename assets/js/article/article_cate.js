$(function () {
    var layer = layui.layer
    initArtCateList()
    var indexAdd = null
    var indexEdit = null
    var form = layui.form
    $('#addCategory').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })

    // 通过代理的形式,为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功!')
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式， 为 btn-edit 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        })
        var id = $(this).attr('data-id')
        console.log(id);
        //  发起请求获取对应
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 为修改的分类的表单添加submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 为每个删除按钮绑定点击删除事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})
// 获取文章分类的列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}