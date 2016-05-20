﻿import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import DT = require('dt');

namespace Product {
    interface Rows {
        product_id?: string;
        check_del?: boolean,
        l1_id: number;
        l2_id: number;
        l3_id: number;
        l1_name?: string;
        l2_name?: string;
        l3_name?: string;
        power?: string;
        sort?: number;
        i_Hide?: boolean;
        i_Lang: string;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
            i_Lang: string
            category_l1: number
            category_l2: number
            i_Hide: boolean
        },
        option_category_l1?: Array<CategoryL1>;
        option_category_l2?: Array<CategoryL2>;
    }
    interface FormResult extends IResultBase {
        id: string
    }
    interface CategoryL1 {
        id: number;
        name: string;
        lang: string;
        l2: Array<CategoryL2>;
    }
    interface CategoryL2 {
        id: number;
        name: string;
    }

    class GridRow extends React.Component<BaseDefine.GridRowPropsBase<Rows>, BaseDefine.GridRowStateBase> {

        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }

        static defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/Product'
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }
        modify() {
            this.props.updateType(this.props.primKey)
        }
        render() {
            let StateForGird = CommCmpt.StateForGird;
            return <tr>
                <td className="text-center"><CommCmpt.GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} /></td>
                <td className="text-center"><CommCmpt.GridButtonModify modify={this.modify} /></td>
                <td>{this.props.itemData.l1_name}</td>
                <td>{this.props.itemData.l2_name}</td>
                <td>{this.props.itemData.power}</td>
                <td>{this.props.itemData.sort }</td>
                <td>{this.props.itemData.i_Hide ? <span className="label label-default">隱藏</span> : <span className="label label-primary">顯示</span>}</td>
                <td></td>
            </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.Product>>{

        category: Array<CategoryL1>;

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.setLangVal = this.setLangVal.bind(this);
            this.changeCategoryL1 = this.changeCategoryL1.bind(this);
            this.changeLang = this.changeLang.bind(this);
            this.render = this.render.bind(this);

            this.category = null;

            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, i_Lang: null, category_l1: null, category_l2: null, i_Hide: null },
                option_category_l1: [],
                option_category_l2: []
            }
        }

        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Product'
        }
        componentDidMount() {
            CommFunc.jqGet(gb_approot + 'api/GetAction/GetCategoryStruc', {})
                .done((data, textStatus, jqXHRdata) => {
                    this.category = data;
                    this.queryGridData(1);
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });

        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                CKEDITOR.replace('description');
                //CKEDITOR.disableAutoInline = true;
            }
        }

        getCategoryByLang(lang: string): Array<CategoryL1> {

            var data: Array<CategoryL1> = [];
            if (this.category != null) {
                this.category.map(function (item, i) {
                    if (item.lang == lang) {
                        data.push(item);
                    }
                })
            }

            return data;
        }
        getL2(id: number, data: Array<CategoryL1>) {

            var ary: Array<CategoryL2> = [];
            data.map(function (item, i) {
                if (item.id == id) {
                    item.l2.map(function (list, j) {
                        ary.push(list);
                    })
                }
            })

            return ary;
        }

        gridData(page: number) {

            var parms = {
                page: 0
            };

            if (page == 0) {
                parms.page = this.state.gridData.page;
            } else {
                parms.page = page;
            }

            $.extend(parms, this.state.searchData);
            return CommFunc.jqGet(this.props.apiPath, parms);
        }
        queryGridData(page: number) {
            this.gridData(page)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {

            e.preventDefault();
            this.state.fieldData.description = CKEDITOR.instances['description'].getData();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: FormResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.updateType(data.id);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '修改完成', 1);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            };
            return;
        }
        deleteSubmit() {

            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].product_id);
                }
            }

            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }

            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '刪除完成', 1);
                        this.queryGridData(0);
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSearch(e: React.FormEvent) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        }
        delCheck(i: number, chd: boolean) {
            let newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        }
        checkAll() {

            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        insertType() {

            var def_lang = 'zh-TW';
            var get_lang_category = this.getCategoryByLang(def_lang);

            this.setState({
                edit_type: 1, fieldData: {
                    i_Hide: false,
                    sort: 0,
                    i_Lang: def_lang
                },
                option_category_l1: get_lang_category
            });
        }
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data: IResultData<server.Product>, textStatus, jqXHRdata) => {

                    let field = data.data;

                    let def_lang = field.i_Lang;
                    let get_lang_category_l1 = this.getCategoryByLang(def_lang);
                    let get_lang_category_l2 = this.getL2(field.l1_id, get_lang_category_l1);

                    this.setState({
                        edit_type: 2,
                        fieldData: field,
                        option_category_l1: get_lang_category_l1,
                        option_category_l2: get_lang_category_l2
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            let searchData = this.state.searchData;

            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({
                        edit_type: 0,
                        gridData: data
                    });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }

        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.fdName, name, e);
        }
        changeGDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;

            let obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
            if (collentName == this.props.gdName) {
                this.queryGridData(1);
            }
        }
        setLangVal(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;

            let obj = this.state[collentName];
            obj[name] = input.value;

            if (collentName == this.props.gdName) {
                this.queryGridData(1);
            }
        }

        changeLang(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;

            let obj = this.state[collentName];
            obj[name] = input.value;
            var category = this.getCategoryByLang(input.value);

            this.setState({
                fieldData: obj,
                option_category_l1: category,
                option_category_l2: []
            });

        }
        changeCategoryL1(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;

            let obj = this.state[collentName];
            obj[name] = input.value;
            obj['l2_id'] = '';

            if (input.value != '' && this.state.fieldData.i_Lang != '') {

                var get_category_l2 = this.getL2(parseInt(input.value, 10), this.category);
                this.setState({ fieldData: obj, option_category_l2: get_category_l2 });
            } else {
                this.setState({ fieldData: obj, option_category_l2: [] });
            }
        }
        render() {

            var outHtml: JSX.Element = null;

            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;

                outHtml =
                    (
                        <div>
                            <h3 className="title">
                                {this.props.caption}
                            </h3>
                            <form onSubmit={this.handleSearch}>
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="table-filter">
                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>標題/分類名稱</label> { }
                                                    <input type="text" className="form-control"
                                                        onChange={this.changeGDValue.bind(this, 'keyword') }
                                                        value={searchData.keyword}
                                                        placeholder="請輸入關鍵字..." /> { }
                                                    <label>狀態</label> { }
                                                    <select className="form-control"
                                                        onChange={this.changeGDValue.bind(this, 'i_Hide') }
                                                        value={searchData.i_Hide} >
                                                        <option value="">全部</option>
                                                        <option value="false">顯示</option>
                                                        <option value="true">隱藏</option>
                                                    </select> { }
                                                    <br />
                                                    <label>語系</label> { }
                                                    <select className="form-control"
                                                        onChange={this.setLangVal.bind(this, this.props.gdName, 'i_Lang') }
                                                        value={searchData.i_Lang} >
                                                        <option value="">全部</option>

                                                    </select> { }
                                                    <label>第一層分類</label> { }

                                                    <label>第二層分類</label> { }

                                                    <label>第三層分類</label> { }

                                                    <button className="btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="col-xs-1 text-center">
                                                    <label className="cbox">
                                                        <input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
                                                        <i className="fa-check"></i>
                                                    </label>
                                                </th>
                                                <th className="col-xs-1 text-center">修改</th>
                                                <th className="col-xs-1">第一層分類</th>
                                                <th className="col-xs-2">第二層分類</th>
                                                <th className="col-xs-2">產品名稱</th>
                                                <th className="col-xs-1">排序</th>
                                                <th className="col-xs-1">狀態</th>
                                                <th className="col-xs-1">語系</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.gridData.rows.map(
                                                    (itemData, i) =>
                                                        <GridRow key={i}
                                                            ikey={i}
                                                            primKey={itemData.product_id}
                                                            itemData={itemData}
                                                            delCheck={this.delCheck}
                                                            updateType={this.updateType} />
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <GridNavPage
                                    startCount={this.state.gridData.startcount}
                                    endCount={this.state.gridData.endcount}
                                    recordCount={this.state.gridData.records}
                                    totalPage={this.state.gridData.total}
                                    nowPage={this.state.gridData.page}
                                    queryGridData={this.queryGridData}
                                    insertType={this.insertType}
                                    deleteSubmit={this.deleteSubmit}
                                    showDelete={true}
                                    />
                            </form>
                        </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                ////分類-選單內容
                outHtml = (
                    <div>
                        <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="col-xs-6">

                                <div className="form-group">
                                    <label className="col-xs-3 control-label">語系</label>
                                    <div className="col-xs-6">
                                        <select className="form-control"
                                            onChange={this.changeLang.bind(this, this.props.fdName, 'i_Lang') }
                                            value={fieldData.i_Lang} >
                                            <option value=""></option>
                                            <option value="zh-TW">中文</option>
                                            <option value="en-US">英文</option>
                                        </select>
                                    </div>
                                    <small className="help-inline col-xs-3 text-danger">(必填) </small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label">分類</label>
                                    <div className="col-xs-3">
                                        <select className="form-control"
                                            onChange={this.changeCategoryL1.bind(this, this.props.fdName, 'l1_id') }
                                            value={fieldData.l1_id} >
                                            <option value=""></option>
                                            {
                                                this.state.option_category_l1.map(function (item, i) {
                                                    return <option value={item.id} key={item.id}>{item.name}</option>;
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-xs-3">
                                        <select className="form-control"
                                            onChange={this.changeFDValue.bind(this, 'l2_id') }
                                            value={fieldData.l2_id} >
                                            <option value=""></option>
                                            {
                                                this.state.option_category_l2.map(function (item, i) {
                                                    return <option value={item.id} key={item.id}>{item.name}</option>;
                                                })
                                            }
                                        </select>
                                    </div>

                                    <small className="help-inline col-xs-1 text-danger">(必填) </small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label">排序</label>
                                    <div className="col-xs-6">
                                        <input type="number" className="form-control" onChange={this.changeFDValue.bind(this, 'sort') } value={fieldData.sort}  />
                                    </div>
                                    <small className="col-xs-3 help-inline">數字越大越前面</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label">狀態</label>
                                    <div className="col-xs-6">
                                        <div className="radio-inline">
                                            <label>
                                                <input type="radio"
                                                    name="i_Hide"
                                                    value={true}
                                                    checked={fieldData.i_Hide === true}
                                                    onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                                    />
                                                <span>隱藏</span>
                                            </label>
                                        </div>
                                        <div className="radio-inline">
                                            <label>
                                                <input type="radio"
                                                    name="i_Hide"
                                                    value={false}
                                                    checked={fieldData.i_Hide === false}
                                                    onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                                    />
                                                <span>顯示</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label">產品名稱</label>
                                    <div className="col-xs-6">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'product_name') } value={fieldData.product_name} maxLength={64} required />
                                    </div>
                                    <small className="col-xs-3 help-inline"><span className="text-danger">(必填) </span>, 最多64字</small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label">型號(Model) </label>
                                    <div className="col-xs-6">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'modal') } value={fieldData.modal} maxLength={64} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-xs-3 control-label">規格</label>
                                    <div className="col-xs-6">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'standard') } value={fieldData.standard} maxLength={64} required />
                                    </div>
                                </div>

                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">產品圖</label>
                                    <div className="col-xs-8">
                                        <CommCmpt.MasterImageUpload FileKind="img1" MainId={fieldData.product_id} ParentEditType={this.state.edit_type} url_upload={gb_approot + 'Active/ProductData/aj_FUpload'} url_list={gb_approot + 'Active/ProductData/aj_FList'}
                                            url_delete={gb_approot + 'Active/ProductData/aj_FDelete'} />
                                        <small className="help-block">最多1張圖，建議尺寸 420*350 px, 每張圖最大不可超過2MB</small>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">附件檔</label>
                                    <div className="col-xs-8">
                                        <CommCmpt.MasterFileUpload FileKind="file1" MainId={fieldData.product_id} ParentEditType={this.state.edit_type} url_upload={gb_approot + 'Active/ProductData/aj_FUpload'}
                                            url_list={gb_approot + 'Active/ProductData/aj_FList'} url_delete={gb_approot + 'Active/ProductData/aj_FDelete'} url_download={gb_approot + 'Active/ProductData/aj_FDown'} />
                                        <small className="help-block">最多1個檔案, 每個檔案最大不可超過4MB; 接受檔案類型為pdf、doc、docx、xls、xlsx、txt、png、jpg、jpeg的檔案</small>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12">
                                <div className="form-group">
                                    <label className="col-xs-1 control-label">詳細介紹</label>
                                    <div className="col-xs-10">
                                        <textarea className="form-control" id="description" name="description"
                                            value={fieldData.description} onChange={this.changeFDValue.bind(this, 'description') }/>
                                    </div>
                                </div>
                            </div>


                            <div className="form-group clear bg-warning">
                                <div className="col-xs-6">
                                    <label className="col-xs-3 control-label">證書文件</label>
                                    <small className="col-xs-9 help-block">每項證書最多1張圖，建議尺寸寬度不超過 1000px, 每張最大不可超過2MB</small>
                                </div>
                            </div>

                            <div className="alert alert-warning alert-dismissible" role="alert">
                                編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br/>
                                ps.youtube 可勾選「用自適應縮放模式」
                            </div>

                            <div className="col-xs-12">
                                <div className="form-action">
                                    <div className="col-xs-4 col-xs-offset-2">
                                        <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                                        <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div >
                );
            }

            return outHtml;
        }
    }


}

var dom = document.getElementById('page_content');
ReactDOM.render(<Product.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);