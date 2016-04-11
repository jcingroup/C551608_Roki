var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');
var Moment = require('moment');
var ReactBootstrap = require("react-bootstrap");
var CommCmpt = require('comm-cmpt');
var CommFunc = require('comm-func');
var dt = require('dt');
var MasterImageUpload = require('ImgFileSort');

var DatePicker = require('react-datepicker');
require("react-datepicker/dist/react-datepicker.css");



var GridRow = React.createClass({

    getInitialState: function () {
        return {

        };
    },
    delCheck: function (i, chd) {
        this.props.delCheck(i, chd);
    },
    modify: function () {
        this.props.updateType(this.props.primKey);
    },
    render: function () {
        return (<tr>
                <td className="text-center">
                    <CommCmpt.GridButtonDel removeItemSubmit={this.props.removeItemSubmit}
                                            primKey={this.props.primKey} />
                </td>
                <td className="text-center">
                    <CommCmpt.GridButtonModify modify={this.modify} />
                </td>
                <td>{this.props.itemData.matter_id}</td>
                <td>{this.props.itemData.matter_name}</td>
        </tr>);
    }
});


var GirdForm = React.createClass({
    getInitialState: function () {
        return {
            fieldData: null,
            gridData: { rows: [], page: 1 },
            edit_type: 0,
            searchData: { keyword: null },
            editPrimKey: null
        };
    },
    getDefaultProps: function () {
        return {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Matter'

        };
    },
    componentDidMount: function () {
        //init component data
        CommFunc.jqGet(gb_approot + 'Api/GetAction/GetOptionsCommunity', {})
            .done(function (data) {
                //console.log(data);
                this.setState({ options_community: data });
            }.bind(this))

        this.queryGridData(1);
    },
    handleSubmit: function (e) {
        e.preventDefault();

        if (this.state.edit_type == 1) {
            CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                .done((data, textStatus, jqXHRdata) => {
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
    },
    deleteSubmit: function (e) {

        if (!confirm('確定是否刪除?')) {
            return;
        }

        var ids = [];
        for (var i in this.state.gridData.rows) {
            if (this.state.gridData.rows[i].check_del) {
                ids.push('ids=' + this.state.gridData.rows[i].Id);
            }
        }

        if (ids.length == 0) {
            tosMessage(null, '未選擇刪除項', 2);
            return;
        }

        jqDelete(this.props.apiPathName + '?' + ids.join('&'), {})
		.done(function (data, textStatus, jqXHRdata) {
		    if (data.result) {
		        tosMessage(null, '刪除完成', 1);
		        this.queryGridData(0);
		    } else {
		        alert(data.message);
		    }
		}.bind(this))
		.fail(function (jqXHR, textStatus, errorThrown) {
		    showAjaxError(errorThrown);
		});
    },
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
    },
    handleSearch: function (e) {
        e.preventDefault();
        this.queryGridData(0);
        return;
    },
    delCheck: function (i, chd) {

        var newState = this.state;
        this.state.gridData.rows[i].check_del = !chd;
        this.setState(newState);
    },
    checkAll: function () {

        var newState = this.state;
        newState.checkAll = !newState.checkAll;
        for (var prop in this.state.gridData.rows) {
            this.state.gridData.rows[prop].check_del = newState.checkAll;
        }
        this.setState(newState);
    },
    gridData: function (page) {

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
    },
    queryGridData: function (page) {
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
    },
    insertType: function () {
        this.setState({ edit_type: 1, fieldData: {} });
    },
    updateType: function (id) {
        var idPack = { id: id }
        CommFunc.jqGet(this.props.apiPath, idPack)
            .done((data, textStatus, jqXHRdata) => {
                this.setState({
                    edit_type: 2,
                    fieldData: data.data,
                    editPrimKey: id
                });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
    },
    noneType: function () {
        this.gridData(0)
            .done((data, textStatus, jqXHRdata) => {
                this.setState({ edit_type: 0, gridData: data, editPrimKey: null });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
    },
    changeFDValue: function (name, e) {
        this.setEventValue(this.props.fdName, name, e);
    },
    changeGDValue: function (name, e) {
        this.setEventValue(this.props.gdName, name, e);
    },
    setEventValue(collentName, name, e) {
        let input = e.target;
        let value;

        if (input.value == 'true') {
            value = true;
        } else if (input.value == 'false') {
            value = false;
        } else {
            value = input.value;
        }
        var objForUpdate = {
            [collentName]:
            {
                [name]: { $set: value }
            }
        };
        var newState = update(this.state, objForUpdate);
        this.setState(newState);
    },
    setInputValue(collentName, name, v) {
        var objForUpdate = {
            [collentName]:
            {
                [name]: { $set: v }
            }
        };
        var newState = update(this.state, objForUpdate);
        this.setState(newState);
    },
    setInputValueMuti(collentName, name, v) {

        var objForUpdate = { [collentName]: {} };
        for (var i in name) {
            var item = name[i];
            var value = v[i];
            objForUpdate[collentName][item] = { $set: value }
        }
        var newState = update(this.state, objForUpdate);
        this.setState(newState);
    },
    changeAddress(data, e) {
        console.log(data);
        if (data.type == 1) {

        }
        if (data.type == 2) {
            this.setInputValue(this.props.fdName, 'city', data.city_value);
        }
        if (data.type == 3) {
            this.setInputValueMuti(this.props.fdName, ['zip', 'country'], [data.zip_value, data.country_value]);
        }
        if (data.type == 4) {
            this.setInputValue(this.props.fdName, 'address', data.address_value);
        }

    },
    render: function () {

        var outHtml = null;
        var GridNavPage = CommCmpt.GridNavPage;

        if (this.state.edit_type == 0) {
            var search = this.state.searchData;
            outHtml =(
                <div>
                            <ul className="breadcrumb">
                                <li>
                                    <i className="fa-list-alt"></i>{this.props.menuName}
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
                                                    <label></label>{}
                                                    <input type="text" className="form-control" onChange={this.changeGDValue.bind(this, 'keyword') } value={this.state.searchData.keyword} placeholder="社區名稱" />{}
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
                                                <th className="col-xs-2">編號</th>
                                                <th className="col-xs-10">社區名稱</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            this.state.gridData.rows.map(function(itemData, i)
                                            {
                                                return (
                                                <GridRow key={i}
                                                         primKey={itemData.matter_id}
                                                         itemData={itemData}
                                                         removeItemSubmit={this.removeItemSubmit}
                                                         updateType={this.updateType} />);
                                            }.bind(this))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <GridNavPage startCount={this.state.gridData.startcount}
                                             endCount={this.state.gridData.endcount}
                                             recordCount={this.state.gridData.records}
                                             totalPage={this.state.gridData.total}
                                             nowPage={this.state.gridData.page}
                                             queryGridData={this.queryGridData}
                                             insertType={this.insertType}
                                             deleteSubmit={this.deleteSubmit}
                                             showDelete={false} />
                            </form>
                </div>
                    );
        }
        else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
            let field = this.state.fieldData;

            var outHtml = (
                <div>
                    <ul className="breadcrumb">
                                    <li>
                                        <i className="fa-list-alt"></i>{this.props.menuName}
                                    </li>
                    </ul>
                    <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
                        <div className="col-xs-10">

                            			<div className="form-group">
						                    <label className="col-xs-1 control-label">代表圖</label>
						                    <div className="col-xs-7">
							                    <MasterImageUpload FileKind="Photo1"
                                                                   MainId={field.matter_id}
                                                                   ParentEditType={this.state.edit_type}
                                                                   url_upload={gb_approot + 'Active/Matter/axFUpload'}
                                                                   url_list={gb_approot+'Active/Matter/axFList'}
                                                                   url_delete={gb_approot+'Active/Matter/axFDelete'}
                                                                   url_sort={gb_approot+'Active/Matter/axFSort'} />
						                    </div>
						                    <small className="help-inline col-xs-4 text-danger">限 1 張圖片</small>
                            			</div>

                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">物件名稱</label>
                                            <div className="col-xs-5">
                                                <input type="text" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'matter_name') }
                                                       value={field.matter_name}
                                                       maxLength={64}
                                                       required />
                                            </div>
                                            <label className="col-xs-1 control-label">來源社區</label>
                                            <div className="col-xs-3">
                                                <select className="form-control"
                                                        required
                                                        value={field.community_id}
                                                        onChange={this.changeFDValue.bind(this, 'community_id') }>
                                                    <option value=""></option>
                                                    {
                                                    this.state.options_community.map(function (item, i) {
                                                        return (
                                                                <option value={item.community_id} key={item.community_id}>{item.community_name}</option>);
                                                    })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">物件地址</label>
                                            <CommCmpt.TwAddress identity="AD1"
                                                                city_value={field.city}
                                                                country_value={field.country}
                                                                address_value={field.address}
                                                                zip_value={field.zip}
                                                                onChange={this.changeAddress}
                                                                index={0} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">房數</label>
                                            <div className="col-xs-1">
                                                <input type="number" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'bedrooms') }
                                                       value={field.bedrooms} />
                                            </div>

                                            <label className="col-xs-1 control-label">廳數</label>
                                            <div className="col-xs-1">
                                                <input type="number" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'livingrooms') }
                                                       value={field.livingrooms} />
                                            </div>

                                            <label className="col-xs-1 control-label">衛浴數</label>
                                            <div className="col-xs-1">
                                                <input type="number" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'bathrooms') }
                                                       value={field.bathrooms} />
                                            </div>

                                            <label className="col-xs-1 control-label">室</label>
                                            <div className="col-xs-1">
                                                <input type="number" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'rooms') }
                                                       value={field.rooms} />
                                            </div>

                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">建物登記坪數</label>
                                            <div className="col-xs-1">
                                                <input type="number" step="0.01" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'build_area') }
                                                       value={field.build_area} />
                                            </div>

                                        <label className="col-xs-1 control-label">土地登記坪數</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="0.01" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'land_area') }
                                                   value={field.land_area} />
                                        </div>

                                        <label className="col-xs-1 control-label">主建物</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="0.01" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'house_area') }
                                                   value={field.house_area} />
                                        </div>

                                        <label className="col-xs-1 control-label">陽台</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="0.01" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'balcony_area') }
                                                   value={field.balcony_area} />
                                        </div>

                                        <label className="col-xs-1 control-label">雨遮</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="0.01" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'umbrella_aea') }
                                                   value={field.umbrella_aea} />
                                        </div>

                                        <label className="col-xs-1 control-label">公設</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="0.01" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'public_area') }
                                                   value={field.public_area} />
                                        </div>

                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">屋齡</label>
                                            <div className="col-xs-1">
                                                <input type="number" step="0.1" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'age') }
                                                       value={field.age} />
                                            </div>

                                        <label className="col-xs-1 control-label">該層戶數</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="1" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'buildhouses') }
                                                   value={field.buildhouses} />
                                        </div>

                                        <label className="col-xs-1 control-label">類型</label>
                                        <div className="col-xs-1">
                                            <select className="form-control"
                                                    value={field.typeOfHouse}
                                                    onChange={this.changeFDValue.bind(this, 'typeOfHouse') }>
                                                <option value=""></option>
                                                <option value="F">大樓</option>
                                                <option value="H">成屋</option>
                                            </select>
                                        </div>

                                        <label className="col-xs-1 control-label">月管理費</label>
                                        <div className="col-xs-1">
                                            <input type="number" step="10" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'managementFeeOfMonth') }
                                                   value={field.managementFeeOfMonth} />
                                        </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">建物結構</label>
                                            <div className="col-xs-2">
                                                <input type="text" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'architecture') }
                                                       value={field.architecture} />
                                            </div>

                                        <label className="col-xs-1 control-label">車位</label>
                                        <div className="col-xs-2">
                                            <input type="text" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'parking') }
                                                   value={field.parking} />
                                        </div>

                                        <label className="col-xs-1 control-label">朝向</label>
                                        <div className="col-xs-2">
                                            <input type="text" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'orientation') }
                                                   value={field.orientation} />
                                        </div>

                                        <label className="col-xs-1 control-label">警衛管理</label>
                                        <div className="col-xs-2">
                                            <input type="text" className="form-control"
                                                   onChange={this.changeFDValue.bind(this, 'guard') }
                                                   value={field.guard} />
                                        </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">邊間</label>
                                            <div className="col-xs-2">
                                                <input type="checkbox" className="form-control"
                                                       onChange={this.setInputValue.bind(this, this.props.fdName, 'is_end', !field.is_end) }
                                                       checked={field.is_end} />
                                            </div>

                                        <label className="col-xs-1 control-label">暗房</label>
                                        <div className="col-xs-2">
                                            <input type="checkbox" className="form-control"
                                                   onChange={this.setInputValue.bind(this, this.props.fdName, 'is_darkroom', !field.is_darkroom) }
                                                   checked={field.is_darkroom} />
                                        </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-xs-1 control-label">外牆建材</label>
                                            <div className="col-xs-2">
                                                <input type="text" className="form-control"
                                                       onChange={this.changeFDValue.bind(this, 'wall_materials') }
                                                       value={field.wall_materials} />
                                            </div>
                                        </div>
                                        <div className="form-action">
                                            <div className="col-xs-4 col-xs-offset-2">
                                                <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button>{}
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
});

var dom = document.getElementById('page_content');
ReactDOM.render(<GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom); 