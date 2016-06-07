CKEDITOR.addTemplates('default', {

    // The name of the subfolder that contains the preview images of the templates.
    imagesPath : '/ckeditor/themes/images/',

    // Template definitions.
    templates : [{
        title: '雙欄',
        image: 'template1.gif',
        description: '雙欄列表格式',
        html: '<dl class="list-info col-6 col-sm-12" data-col="first"><dt class="list-info-title">左欄標題</dt><dd class="list-info-content"><ul class="list-dot"><li>內容</li></ul></dd></dl><dl class="list-info col-6 col-sm-12" data-col="last"><dt class="list-info-title">右欄標題</dt><dd class="list-info-content"><ul class="list-dot"><li>右欄內容</li></ul></dd></dl>'
    }, {
        title: '單欄',
        image: 'template2.gif',
        description: '滿版列表格式',
        html: '<dl class="list-info"><dt class="list-info-title">標題</dt><dd class="list-info-content"><ul class="list-dot"><li>內容</li></ul></dd></dl>'
    }]
});
