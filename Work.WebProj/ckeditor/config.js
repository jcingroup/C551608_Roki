CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'zh';
    // config.uiColor = '#AADC6E';

    config.contentsCss = ['../../Content/css/editor.css'];
    config.toolbar = [
        { name: "document", items: ["Source", "-"] },
        { name: "tools", items: ["Maximize", "-"] },
        {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"]
        },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        {
            name: 'insert',
            items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
        },
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Underline", "Strike", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "RemoveFormat"]
        },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "styles", items: ["Styles", "Format"] },
        { name: "editing" }
    ];
    config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;
    config.allowedContent = true;
    config.fontSize_sizes = '12px/12px;13/13px;16/16px;18/18px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';
};

CKEDITOR.stylesSet.add('default', [
    // Block Styles
    { name: '標題 - 樣式1', element: 'h2' },
    { name: '標題 - 樣式2', element: 'h3' },
    { name: '標題 - 樣式3', element: 'h4' },
    { name: '標題 - 樣式4', element: 'h5' },

    // Object Styles
    { name: '列表 - 預設', element: 'ul', attributes: { 'class': 'list-unstyled' } },
    { name: '列表 - 有圖標', element: 'ul', attributes: { 'class': 'list-dot' } },
    { name: '數字列表 - 預設', element: 'ol', attributes: { 'class': 'list-unstyled' } },
    { name: '數字列表 - 有圖標', element: 'ol', attributes: { 'class': 'list-dot' } },
    { name: '表格 - 預設', element: 'table' },
    // { name: '圖片 - 加框', element: 'img', attributes: { 'class': 'thumb' } }
]);