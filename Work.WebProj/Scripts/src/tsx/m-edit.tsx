import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');

namespace Edit {
    interface Rows {
        check_del: boolean,
        edit_id: number,
        edit_name: string,
        sort: number,
    }
    interface GirdFormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
        }
    }
    interface IDName {
        id: number | string //數字型用id 字串型用no
    }
    interface CallResult extends IResultBase, IDName { }

    class GridRow extends React.Component<BaseDefine.GridRowPropsBase2<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            //this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
        }
        //delCheck(i, chd) {
        //    this.props.delCheck(i, chd);
        //}
        modify() {
            this.props.updateType(this.props.primKey)
        }

        render() {
            return <tr>
                <td className="text-center">
                    <CommCmpt.GridButtonDel
                        removeItemSubmit={this.props.removeItemSubmit}
                        primKey={this.props.primKey} />
                </td>
                <td className="text-center">
                    <CommCmpt.GridButtonModify modify={this.modify}/>
                    </td>
                <td>{this.props.itemData.edit_name}</td>
                <td>{this.props.itemData.sort}</td>
            </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, GirdFormState<Rows, server.Edit>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.removeItemSubmit = this.removeItemSubmit.bind(this);

            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);

            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.componentWillUnmount = this.componentWillUnmount.bind(this);

            this.insertType = this.insertType.bind(this);
            this.state = {
                fieldData: null,
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null },
                editPrimKey: null
            };

        }

        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Edit'
        }
        componentDidMount() {
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == IEditType.none && (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update))) {
                console.log('CKEDITOR');
                CKEDITOR.replace('edit_content', { customConfig: '../ckeditor/inlineConfig.js' });
            }
        }
        componentWillUnmount() {
            //元件被從 DOM 卸載之前執行，通常我們在這個方法清除一些不再需要地物件或 timer。
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
                    if (data.records == 0) {
                        CommFunc.tosMessage(null, '無任何資料', ToastrType.warning);
                    }
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSubmit(e: React.FormEvent) {
            e.preventDefault();
            this.state.fieldData.edit_content = CKEDITOR.instances['edit_content'].getData();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: CallResult, textStatus, jqXHRdata) => {
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

                var packData = { id: this.state.editPrimKey, md: this.state.fieldData };

                CommFunc.jqPut(this.props.apiPath, packData)
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
                    ids.push('ids=' + this.state.gridData.rows[i].edit_id);
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
        removeItemSubmit(primKey) {
            if (!confirm('確定是否刪除?')) {
                return;
            }

            CommFunc.jqDelete(this.props.apiPath, { id: primKey })
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
            this.setState({
                edit_type: IEditType.insert, fieldData: {}
            });
        }
        updateType(id: number | string) {
            var idPack: IDName = { id: id }
            CommFunc.jqGet(this.props.apiPath, idPack)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({
                        edit_type: IEditType.update,
                        fieldData: data.data,
                        editPrimKey: id
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            this.gridData(0)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: IEditType.none, gridData: data, editPrimKey: null });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
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
        }

        render() {

            var outHtml: JSX.Element = null;
            var GridNavPage = CommCmpt.GridNavPage;

            if (this.state.edit_type == IEditType.none) {
                var searchData = this.state.searchData;
                outHtml =
                    (
                        <div>
                            <ul className="breadcrumb">
                                <li><i className="fa-list-alt"></i>
                                    {this.props.menuName}
                                </li>
                            </ul>
                            <h3 className="title">
                                {this.props.caption}
                            </h3>
                            <form onSubmit={this.handleSearch}>
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="table-filter">
                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label></label>
                                                    {}
                                                    <input type="text" className="form-control" onChange={this.changeGDValue.bind(this, 'keyword') } value={this.state.searchData.keyword} placeholder="名稱" />
                                                    {}
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
                                                <th className="col-xs-4">名稱</th>
                                                <th className="col-xs-4">排序</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.gridData.rows.map(
                                                (itemData, i) =>
                                                    <GridRow key={i}
                                                        primKey={itemData.edit_id}
                                                        itemData={itemData}
                                                        //delCheck={this.delCheck}
                                                        removeItemSubmit={this.removeItemSubmit}
                                                        updateType={this.updateType} />
                                            ) }
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
                                    showDelete={false}
                                    />
                            </form>
                        </div>
                    );
            }
            else if (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update) {

                let fieldData = this.state.fieldData;

                var outHtml = (
                    <div>
                        <ul className="breadcrumb">
                            <li>
                                <i className="fa-list-alt"></i>
                                {this.props.menuName}
                            </li>
                        </ul>
                        <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="col-xs-10">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">標題</label>
                                    <div className="col-xs-8">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'edit_name') } value={fieldData.edit_name} maxLength={64}
                                            required />
                                    </div>
                                    <small className="col-xs-2 text-danger">(必填) </small>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">內容</label>
                                    <div className="col-xs-10">
                                        <textarea type="date" className="form-control" id="edit_content" name="edit_content"
                                            value={fieldData.edit_content} onChange={this.changeFDValue.bind(this, 'edit_content') }/>
                                        </div>
                                    </div>
                                <div className="form-action">
                                    <div className="col-xs-4 col-xs-offset-2">
                                        <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                                        <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            }
            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<Edit.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom); 