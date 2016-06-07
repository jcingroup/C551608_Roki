CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'zh';
    // config.uiColor = '#AADC6E';

    config.contentsCss = ['../../Content/css/editor.css'];
    config.toolbar = [
        { name: "document", items: ['Source','Templates'] },
        {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"]
        },
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Underline", "Strike", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "RemoveFormat"]
        },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "styles", items: ["Styles"] },
        {
            name: 'insert',
            items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'Iframe']
        },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        { name: "tools", items: ["Maximize", "-"] },
        { name: "editing" }
    ];
    config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;
    config.allowedContent = true;

    // 字元設定
    config.fontSize_sizes = '14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';

    // 特殊字元符號
    config.specialChars = ['℃', 'Ω', '±', '∀', '∁', '∂', '∃', '∄', '∅', 'Δ', '∇', '∈', '∉', 'ε', '∋', '∌', '∍', '∎', 'Π', '∐', 'Σ', '−', '∓', '∔', '∕', '∗', '∘', '∙', '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '∣', '∤', '∥', '∦', '∧', '∨', '∩', '∪', '∫', '∬', '∭', '∮', '∯', '∰', '∱', '∲', '∳', '∴', '∵', '∶', '∷', '∸', '∹', '∺', '∻', '∼', '∽', '∾', '∿', '≀', '≁', '≂', '≃', '≄', '≅', '≆', '≇', '≈', '≉', '≊', '≋', '≌', '≍', '≎', '≏', '≐', '≑', '≒', '≓', '≔', '≕', '≖', '≗', '≘', '≙', '≚', '≛', '≜', '≝', '≞', '≟', '≠', '≡', '≢', '≣', '≤', '≥', '≦', '≧', '≨', '≩', '≪', '≫', '≬', '≭', '≮', '≯', '≰', '≱', '≲', '≳', '≴', '≵', '≶', '≷', '≺', '≻', '≼', '≽', '≾', '≿', '⊀', '⊁', '⊂', '⊃', '⊄', '⊅', '⊆', '⊇', '⊈', '⊉', '⊊', '⊋', '⊌', '⊍', '⊎', '⊏', '⊐', '⊑', '⊓', '⊔', '⊕', '⊖', '⊗', '⊘', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞', '⊟', '⊠', '⊡', '⊢', '⊣', '⊤', '⊥', '⊦', '⊧', '⊨', '⊩', '⊪', '⊫', '⊬', '⊭', '⊮', '⊯', '⊰', '⊱', '⊲', '⊳', '⊴', '⊵', '⊹', '⊺', '⊻', '⊼', '⊽', '⊿', '⋀', '⋁', '⋂', '⋃', '⋄', '⋅', '⋆', '⋇', '⋍', '⋎', '⋏', '⋐', '⋑', '⋒', '⋓', '⋔', '⋕', '⋖', '⋗', '⋘', '⋙', '⋚', '⋛', '⋜', '⋝', '⋞', '⋟', '⋠', '⋡', '⋢', '⋣', '⋤', '⋥', '⋦', '⋧', '⋨', '⋩', '⋪', '⋫', '⋬', '⋭', '⋮', '⋯', '⋰', '⋱'];

    // 範本樣式
    config.templates_files = [ '/ckeditor/themes/ckeditor_templates.js?v1' ];
    config.templates_replaceContent = true;
};

CKEDITOR.stylesSet.add('default', [
    // Block Styles
    { name: '標題1', element: 'h2' },
    { name: '標題2', element: 'h3' },
    { name: '標題3', element: 'h4' },
    { name: '標題4', element: 'h5' },

    // Object Styles
    { name: '列表 - 無圖標', element: 'ul', attributes: { 'class': 'list-unstyled' } },
    { name: '列表 - 有圖標', element: 'ul', attributes: { 'class': 'list-dot' } },
    { name: '數字列表 - 預設樣式', element: 'ol' },
    { name: '數字列表 - 無數字', element: 'ol', attributes: { 'class': 'list-unstyled' } },
    { name: '數字列表 - 數字轉圓點', element: 'ol', attributes: { 'class': 'list-dot' } },
    { name: '表格樣式', element: 'table' },
    // { name: '圖片 - 加框', element: 'img', attributes: { 'class': 'thumb' } }
]);