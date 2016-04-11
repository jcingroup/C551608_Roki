import React = require('react');
import ReactDOM = require('react-dom');
import CommFunc = require('comm-func');
import ReactBootstrap = require('react-bootstrap');
import Moment = require('moment');
import Sortable = require('sortablejs');
import upload = require("simple-ajax-uploader");
import DT = require("dt");

export class GridButtonModify extends React.Component<{ modify(): void, ver?: number }, { className: string }> {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            className: 'fa-pencil'
        }
    }
    componentDidMount() {
        if (this.props.ver == 2) {
            this.setState({ className: 'fa-search-plus' });
        }
    }
    static defaultProps = {
        ver: 1
    };
    onClick() {
        this.props.modify();
    }
    render() {
        return <button type="button" className="btn-link btn-lg" onClick={this.onClick}><i  className={this.state.className}></i></button>
    }
}
export class GridCheckDel extends React.Component<
    { delCheck(p1: any, p2: any): void, iKey: number, chd: boolean, showAdd?: boolean }, any>
{
    constructor() {
        super()
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        this.props.delCheck(this.props.iKey, this.props.chd);
    }
    render() {
        return <label className="cbox">
            <input type="checkbox" checked={this.props.chd} onChange={this.onChange} />
            <i className="fa-check"></i>
        </label>
    }
}


export class GridButtonDel extends React.Component<GridButtonDelProps, any>
{
    constructor() {
        super()
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) {
        this.props.removeItemSubmit(this.props.primKey);
    }
    render() {
        return <button type="button" onClick={this.onClick} className="btn-link btn-lg text-danger">
            <i className="fa-times"></i>
        </button>;
    }
}
export class GridNavPage extends React.Component<GridNavPageProps, any> {
    constructor(props) {
        super(props)
        this.nextPage = this.nextPage.bind(this);
        this.prvePage = this.prvePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }
    static defaultProps = {
        showAdd: true,
        showDelete: true
    };
    firstPage() {
        this.props.queryGridData(1);
    }
    lastPage() {
        this.props.queryGridData(this.props.totalPage);
    }
    nextPage() {
        if (this.props.nowPage < this.props.totalPage) {
            this.props.queryGridData(this.props.nowPage + 1);
        }
    }
    prvePage() {
        if (this.props.nowPage > 1) {
            this.props.queryGridData(this.props.nowPage - 1);
        }
    }
    jumpPage() {

    }
    render() {
        var setAddButton = null, setDeleteButton = null;
        if (this.props.showAdd) {
            setAddButton = <button className="btn-link text-success"
                type="button"
                onClick={this.props.insertType}>
                <i className="fa-plus-circle"></i> 新增
            </button>;
        }

        if (this.props.showDelete) {
            setDeleteButton = <button className="btn-link text-danger" type="button"
                onClick={this.props.deleteSubmit}>
                <i className="fa-trash-o"></i> 刪除
            </button>;

        }
        var oper = null;

        oper = (
            <div className="table-footer">
                <div className="pull-left">
                    {setAddButton}
                    {setDeleteButton}
                </div>
                <small className="pull-right">第{this.props.startCount}-{this.props.endCount}筆，共{this.props.recordCount}筆</small>

                <ul className="pager">
                    <li>
                        <a href="#" title="移至第一頁" tabIndex={-1} onClick={this.firstPage}>
                            <i className="fa-angle-double-left"></i>
                        </a>
                    </li> { }
                    <li>
                        <a href="#" title="上一頁" tabIndex={-1} onClick={this.prvePage}>
                            <i className="fa-angle-left"></i>
                        </a>
                    </li> { }
                    <li className="form-inline">
                        <div className="form-group">
                            <label>第</label>
                            {' '}
                            <input className="form-control text-center" type="number" min="1" tabIndex={-1} value={this.props.nowPage.toString() }
                                onChange={this.jumpPage} />
                            {' '}
                            <label>頁，共{this.props.totalPage}頁</label>
                        </div>
                    </li> { }
                    <li>
                        <a href="#" title="@Resources.Res.NextPage" tabIndex={-1} onClick={this.nextPage}>
                            <i className="fa-angle-right"></i>
                        </a>
                    </li> { }
                    <li>
                        <a href="#" title="移至最後一頁" tabIndex={-1} onClick={this.lastPage}>
                            <i className="fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        );

        return oper;
    }
}

export class Tips extends React.Component<{ comment: string, children?: any }, any>{
    render() {
        //
        var Tooltip = ReactBootstrap.Tooltip;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        const tooltipObj = (<Tooltip>{this.props.comment}</Tooltip>);
        var out_html = null;
        out_html = (<OverlayTrigger placement="top" overlay={tooltipObj}><span className="badge">?</span></OverlayTrigger>);

        return out_html;
    }
}

interface FileUpProps {
    url_upload?: string,
    url_list?: string,
    url_delete?: string,
    url_download?: string,
    url_sort?: string,
    FileKind: string,
    MainId: number | string,
    ParentEditType?: number
}
interface FileUpState {
    filelist: Array<any>
}
//圖片上傳
export class MasterImageUpload extends React.Component<FileUpProps, FileUpState>{
    _sortable: any;
    _upload: any;

    constructor() {
        super();
        this.createFileUpLoadObject = this.createFileUpLoadObject.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.sortableGroupDecorator = this.sortableGroupDecorator.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            filelist: []
        }

        this._sortable = null;
        this._upload = null;

        if (Array.prototype.move === undefined) {
            Array.prototype.move = function (old_index, new_index) {
                if (new_index >= this.length) {
                    var k = new_index - this.length;
                    while ((k--) + 1) {
                        this.push(undefined);
                    }
                }
                this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                return this;
            };
        }
    }
    static defaultProps: FileUpProps = {
        MainId: 0,
        FileKind: 'F'
    }

    componentDidMount() {
        this.createFileUpLoadObject();
        this.getFileList();
    }
    componentDidUpdate(prevProps, prevState) {

    }
    componentWillUnmount() {
        this._sortable.destroy();
        this._upload.destroy();
    }

    deleteFile(guid) {
        CommFunc.jqPost(this.props.url_delete, {
            id: this.props.MainId,
            fileKind: this.props.FileKind,
            guid: guid
        })
            .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    this.getFileList();
                } else {
                    alert(data.message);
                }
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
    }
    createFileUpLoadObject() {

        if (this.props.ParentEditType == 1)
            return;

        let btn = document.getElementById('upload-btn-' + this.props.MainId + '-' + this.props.FileKind);
        let _this = this;

        this._upload = new upload.SimpleUpload({
            button: btn,
            url: this.props.url_upload,
            data: {
                id: this.props.MainId,
                fileKind: this.props.FileKind
            },
            name: 'fileName',
            multiple: true,
            maxSize: 5000,
            allowedExtensions: ['jpg', 'jpeg', 'png'],
            accept: 'image/*',
            responseType: 'json',
            encodeCustomHeaders: true,
            onSubmit: function (filename, ext) {
                if (_this.props.MainId == 0) {
                    alert('此筆資料未完成新增，無法上傳檔案!')
                    return false;
                }

                var progress = document.createElement('div'), // container for progress bar
                    bar = document.createElement('div'), // actual progress bar
                    fileSize = document.createElement('div'), // container for upload file size
                    wrapper = document.createElement('div'), // container for this progress bar
                    progressBox = document.getElementById('progressBox-' + _this.props.MainId + '-' + _this.props.FileKind); // on page container for progress bars

                // Assign each element its corresponding class
                progress.className = 'progress';
                bar.className = 'progress-bar progress-bar-success progress-bar-striped active';
                fileSize.className = 'size';
                wrapper.className = 'wrapper';
                // Assemble the progress bar and add it to the page

                progress.appendChild(bar);
                wrapper.innerHTML = '<div class="name">' + filename + '</div>'; // filename is passed to onSubmit()
                wrapper.appendChild(fileSize);
                wrapper.appendChild(progress);
                progressBox.appendChild(wrapper); // just an element on the page to hold the progress bars    

                // Assign roles to the elements of the progress bar
                this.setProgressBar(bar); // will serve as the actual progress bar
                this.setFileSizeBox(fileSize); // display file size beside progress bar
                this.setProgressContainer(wrapper); // designate the containing div to be removed after upload	
            },
            onSizeError: function () {
                //errBox.innerHTML = 'Files may not exceed 500K.';
            },
            onExtError: function () {
                //errBox.innerHTML = 'Invalid file type. Please select a PNG, JPG, GIF image.';
            },
            onComplete: function (file, response) {
                if (response.result) {
                    _this.getFileList();
                } else {
                    alert(response.message);
                }
            }
        });
    }

    getFileList() {
        CommFunc.jqPost(this.props.url_list, {
            id: this.props.MainId,
            fileKind: this.props.FileKind
        })
            .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    this.setState({ filelist: data.files })
                } else {
                    alert(data.message);
                }
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
    }

    sortableGroupDecorator(componentBackingInstance) {
        // check if backing instance not null
        if (componentBackingInstance) {

            let _this = this;

            let options = {
                draggable: "span",
                group: "shared",
                onSort: function (evt) {

                    var data_array = _this.state.filelist;
                    data_array.move(evt.oldIndex, evt.newIndex);

                    var parms = [];
                    for (var i in data_array) {
                        var item = data_array[i];
                        parms.push(item.guid);
                    }

                    CommFunc.jqPost(_this.props.url_sort, {
                        id: _this.props.MainId,
                        fileKind: _this.props.FileKind,
                        guids: parms
                    })
                        .done(function (data, textStatus, jqXHRdata) {
                            if (data.result) {
                                _this.setState({ filelist: [] });
                                _this.setState({ filelist: data_array });

                            } else {
                                alert(data.message);
                            }
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            showAjaxError(errorThrown);
                        });
                },
                onEnd: function (evt) {
                    console.log('onEnd');
                    //_this.setState({});
                },
                onUpdate: function (/**Event*/evt) {
                    var itemEl = evt.item;  // dragged HTMLElement
                    // + indexes from onEnd
                    console.log('onUpdate');
                },
            };

            this._sortable = Sortable.create(componentBackingInstance, options);
        }
    };

    render() {

        var outHtml = null;
        outHtml = (
            <div>
                <div className="form-control">
                    <input type="file" id={'upload-btn-' + this.props.MainId + '-' + this.props.FileKind} accept="image/*" />
                </div>
                <p className="help-block group-list" ref={this.sortableGroupDecorator}>
                    {
                        this.state.filelist.map(function (itemData, i) {
                            //console.log('Map=>', itemData.fileName);
                            var subOutHtml =
                                <span className="img-upload" key={itemData.guid}>
                                    <button type="button"
                                        className="close"
                                        onClick={this.deleteFile.bind(this, itemData.guid) }
                                        title="刪除圖片"> &times; </button>
                                    <img src={itemData.iconPath} title={CommFunc.formatFileSize(itemData.size) } />
                                </span>;
                            return subOutHtml;
                        }.bind(this))
                    }
                </p>
                <div id={'progressBox-' + this.props.MainId + '-' + this.props.FileKind} className="progress-wrap"></div>
            </div>
        );
        return outHtml;
    }
}
//檔案上傳
export class MasterFileUpload extends React.Component<FileUpProps, any>{

    constructor() {
        super();
        this.createFileUpLoadObject = this.createFileUpLoadObject.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            filelist: [],
            download_src: ''
        }
    }
    static defaultProps: FileUpProps = {
        MainId: 0,
        FileKind: 'F'
    }

    componentDidMount() {
        if (typeof this.props.MainId === 'string') {
            if (this.props.MainId != null) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        } else if (typeof this.props.MainId === 'number') {
            if (this.props.MainId > 0) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (typeof this.props.MainId === 'string') {
            if (this.props.MainId != null && prevProps.MainId == null) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        } else if (typeof this.props.MainId === 'number') {
            if (this.props.MainId > 0 && prevProps.MainId == 0) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
    }
    deleteFile(filename) {
        CommFunc.jqPost(this.props.url_delete, {
            id: this.props.MainId,
            fileKind: this.props.FileKind,
            filename: filename
        })
            .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    this.getFileList();
                } else {
                    alert(data.message);
                }
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
    }
    downloadFile(id, filekind, filename) {
        var parms = [];
        parms.push('id=' + id);
        parms.push('filekind=' + filekind);
        parms.push('filename=' + filename);
        parms.push('tid=' + CommFunc.uniqid());
        var src = this.props.url_download + '?' + parms.join('&');
        this.setState({ download_src: src });
    }
    createFileUpLoadObject() {

        if (this.props.ParentEditType == 1)
            return;

        let btn = document.getElementById('upload-btn-' + this.props.MainId + '-' + this.props.FileKind);
        let _this = this;

        var uploader = new upload.SimpleUpload({
            button: btn,
            url: this.props.url_upload,
            data: {
                id: this.props.MainId,
                fileKind: this.props.FileKind
            },
            name: 'fileName',
            multiple: true,
            maxSize: 5000,
            allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
            accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/*',
            responseType: 'json',
            encodeCustomHeaders: true,
            onSubmit: function (filename, ext) {
                if (_this.props.MainId == 0) {
                    alert('此筆資料未完成新增，無法上傳檔案!')
                    return false;
                }

                var progress = document.createElement('div'), // container for progress bar
                    bar = document.createElement('div'), // actual progress bar
                    fileSize = document.createElement('div'), // container for upload file size
                    wrapper = document.createElement('div'), // container for this progress bar
                    progressBox = document.getElementById('progressBox-' + _this.props.MainId); // on page container for progress bars

                // Assign each element its corresponding class
                progress.className = 'progress';
                bar.className = 'progress-bar progress-bar-success progress-bar-striped active';
                fileSize.className = 'size';
                wrapper.className = 'wrapper';

                // Assemble the progress bar and add it to the page
                progress.appendChild(bar);
                wrapper.innerHTML = '<div class="name">' + filename + '</div>'; // filename is passed to onSubmit()
                wrapper.appendChild(fileSize);
                wrapper.appendChild(progress);
                progressBox.appendChild(wrapper); // just an element on the page to hold the progress bars    

                // Assign roles to the elements of the progress bar
                this.setProgressBar(bar); // will serve as the actual progress bar
                this.setFileSizeBox(fileSize); // display file size beside progress bar
                this.setProgressContainer(wrapper); // designate the containing div to be removed after upload	
            },
            onSizeError: function () {
                //errBox.innerHTML = 'Files may not exceed 500K.';
            },
            onExtError: function () {
                //errBox.innerHTML = 'Invalid file type. Please select a PNG, JPG, GIF ,DOC ,DOCX , image.';
            },
            onComplete: function (file, response) {
                if (response.result) {
                    _this.getFileList();
                } else {
                    alert(response.message);
                }
            }
        });
    }
    getFileList() {
        CommFunc.jqPost(this.props.url_list, {
            id: this.props.MainId,
            fileKind: this.props.FileKind
        })
            .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    this.setState({ filelist: data.files })
                } else {
                    alert(data.message);
                }
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
    }
    render() {

        var outHtml = null;
        var fileButtonHtml = null;
        if (this.props.ParentEditType == 1) {
            fileButtonHtml = (
                <div className="form-control">
                    <small className="col-xs-6 help-inline">請先按儲存後方可上傳檔案</small>
                </div>
            );
        } else if (this.props.ParentEditType == 2) {
            fileButtonHtml = (
                <div className="form-control">
                    <input type="file" id={'upload-btn-' + this.props.MainId + '-' + this.props.FileKind} />
                </div>
            );
        };
        outHtml = (
            <div>
                {fileButtonHtml}
                <p className="help-block" ref="SortImage">
                    {
                        this.state.filelist.map(function (itemData, i) {
                            var subOutHtml =
                                <span className="doc-upload" key={i}>
                                    <i className="fa-file-text-o"></i>
                                    <button type="button"
                                        className="close"
                                        onClick={this.deleteFile.bind(this, itemData.fileName) }
                                        title="刪除檔案"> &times; </button>
                                    <button type="button" className="btn-link" onClick={this.downloadFile.bind(this, this.props.MainId, this.props.FileKind, itemData.fileName) } >
                                        {itemData.fileName}</button>
                                </span>;
                            return subOutHtml;
                        }, this)
                    }
                </p>
                <div id={'progressBox-' + this.props.MainId} className="progress-wrap"></div>
                <iframe src={this.state.download_src} style={ { visibility: 'hidden', display: 'none' } } />
            </div>
        );
        return outHtml;
    }
}

export class TwAddress extends React.Component<TwAddressProps, any>{
    constructor(props) {
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);

        this.onZipChange = this.onZipChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.listCountry = this.listCountry.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            country_list: []
        };
    }
    static defaultProps = {
        onChange: null,
        zip_value: null,
        city_value: null,
        country_value: null,
        address_value: null,
        required: false,
        disabled: false,
        ver: 1
    }

    componentDidMount() {
        if (this.props.city_value != null) {
            this.listCountry(this.props.city_value);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.city_value != null && this.props.city_value != prevProps.city_value) {
            this.listCountry(this.props.city_value);
        }
    }

    onZipChange(e: React.SyntheticEvent) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        var data = {
            identity: this.props.identity,
            zip_value: input.value,
            city_value: this.props.city_value,
            country_value: this.props.country_value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 1
        }
        this.props.onChange(data, e);
    }
    onCityChange(e: React.SyntheticEvent) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        var data = {
            identity: this.props.identity,
            zip_value: this.props.zip_value,
            city_value: input.value,
            country_value: this.props.country_value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 2
        }
        this.listCountry(input.value);
        this.props.onChange(data, e);
    }
    onCountryChange(e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let zip_value = null;

        for (var i in this.state.country_list) {
            var item = this.state.country_list[i];
            if (item.county == input.value) {
                zip_value = item.zip;
                break;
            }
        }

        var data = {
            identity: this.props.identity,
            zip_value: zip_value,
            city_value: this.props.city_value,
            country_value: input.value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 3
        }
        this.props.onChange(data, e);
    }
    onAddressChange(e: React.SyntheticEvent) {
        let input: HTMLSelectElement = e.target as HTMLSelectElement;
        var data = {
            identity: this.props.identity,
            zip_value: this.props.zip_value,
            city_value: this.props.city_value,
            country_value: this.props.country_value,
            address_value: input.value,
            index: this.props.index,
            type: 4
        }
        this.props.onChange(data, e);
    }

    listCountry(value) {

        if (value == null || value == undefined || value == '') {
            this.setState({ country_list: [] });
        }
        else {
            for (var i in DT.twDistrict) {
                var item = DT.twDistrict[i];
                if (item.city == value) {
                    //console.log('country_value',this.props.country_value);
                    this.setState({ country_list: item.contain });
                    //if (this.props.country_value != null) {

                    //    var obj = this.state;
                    //    this.setState(obj);
                    //}
                    break;
                }
            }
        }
    }

    render() {
        var out_html = null;
        if (this.props.ver == 1) {


            out_html = (
                <div>
                    <div className="col-xs-1">
                        <input type="text"
                            className="form-control"
                            value={this.props.zip_value}
                            onChange={this.onZipChange}
                            maxLength={5}
                            required disabled />
                    </div>
                    <div className="col-xs-2">
                        <select className="form-control"
                            value={this.props.city_value}
                            onChange={this.onCityChange}
                            required={this.props.required}
                            disabled={this.props.disabled}>
                            <option value=""></option>
                            {
                                DT.twDistrict.map(function (itemData, i) {
                                    return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="col-xs-2">
                        <select className="form-control"
                            value={this.props.country_value}
                            onChange={this.onCountryChange}
                            required={this.props.required}
                            disabled={this.props.disabled}>
                            <option value=""></option>
                            {
                                this.state.country_list.map(function (itemData, i) {
                                    return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="col-xs-3">
                        <input 	type="text"
                            className="form-control"
                            value={this.props.address_value}
                            onChange={this.onAddressChange }
                            maxLength={128}
                            required={this.props.required}
                            disabled={this.props.disabled}/>
                    </div>
                </div>
            );
        }

        return out_html;
    }
}
export class StateForGird extends React.Component<{ stateData: Array<server.StateTemplate>, id: number | string, ver?: number }, { setClass: string, label: string }>{
    constructor() {

        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.render = this.render.bind(this);

        this.state = {
            setClass: null,
            label: null
        }
    }
    static defaultProps = {
        stateData: [],
        id: null,
        ver: 1
    }
    componentWillReceiveProps(nextProps) {
        //當元件收到新的 props 時被執行，這個方法在初始化時並不會被執行。使用的時機是在我們使用 setState() 並且呼叫 render() 之前您可以比對 props，舊的值在 this.props，而新值就從 nextProps 來。
        for (var i in this.props.stateData) {
            var item = this.props.stateData[i];
            if (item.id == nextProps.id) {
                this.setState({ setClass: item.classNameforG, label: item.label });
                break;
            }
        }
    }
    componentDidMount() {
        for (var i in this.props.stateData) {
            var item = this.props.stateData[i];
            if (item.id == this.props.id) {
                this.setState({ setClass: item.classNameforG, label: item.label });
                break;
            }
        }
    }
    render() {
        let outHtml: JSX.Element = null;
        outHtml = <span className={this.state.setClass}>
            {this.state.label}
        </span>;
        return outHtml;
    }
} 