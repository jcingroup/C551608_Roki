            outHtml = (
                <div className="wrap">
                    <div className="filter">
                        <form className="form-inline">
                            <div className="form-group">
                                <label className="sr-only" htmlFor="">縣市</label>
                                <div className="btn-group">
                                    <button aria-expanded="false" aria-haspopup="true" data-toggle="dropdown" className="btn btn-secondary style2 dropdown-toggle" type="button">縣市<i className="ti-angle-down" /></button>
                                    <div className="dropdown-menu city">
                                        <div className="row">
                                            <label className="col-xs-2 form-control-label text-xs-right" htmlFor="">北部</label>
                                            <div className="col-xs-10 input-inline-group">
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    北市
                                                </label>
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    新北市
                                                </label>
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    桃園市
                                                </label>
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    竹市
                                                </label>
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    竹縣
                                                </label>
                                                <label className="c-input c-radio m-b-0">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    基隆
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="sr-only" htmlFor="">總價</label>
                                <div className="btn-group">
                                    <button aria-expanded="false" aria-haspopup="true" data-toggle="dropdown" className="btn btn-secondary style2 dropdown-toggle" type="button">總價<i className="ti-angle-down" /></button>
                                    <div className="dropdown-menu price form-inline p-t-1">
                                        <div className="input-group">
                                            <select className="form-control form-control-sm">
                                                <option value>0</option>
                                                <option value>200</option>
                                                <option value>400</option>
                                                <option value>800</option>
                                            </select>
                                            <span className="input-group-addon form-control-sm">萬</span>
                                        </div>
                                        ~
                                        <div className="input-group">
                                            <select className="form-control form-control-sm">
                                                <option value>不限</option>
                                                <option value>200</option>
                                                <option value>400</option>
                                                <option value>800</option>
                                            </select>
                                            <span className="input-group-addon form-control-sm">萬</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="sr-only" htmlFor="">坪數</label>
                                <div className="btn-group">
                                    <button data-toggle="dropdown" className="btn btn-secondary style2 dropdown-toggle" type="button">坪數<i className="ti-angle-down" /></button>
                                    <div className="dropdown-menu size form-inline">
                                        <label htmlFor="">計算方式：</label>
                                        <select className="form-control form-control-sm">
                                            <option value>建坪</option>
                                            <option value>主+陽</option>
                                            <option value>地坪</option>
                                        </select>
                                        <hr className="sm" />
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            0坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            20坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            30坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            40坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            50坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            60坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            100坪以上
                                        </label>
                                        <label className="c-input c-radio">
                                            <input type="radio" />
                                            <span className="c-indicator" />
                                            <span className="input-group">
                                                <input type="text" className="form-control form-control-sm w-x-4" />
                                                <span className="input-group-addon form-control-sm">坪</span>
                                            </span>
                                            ~
                                            <span className="input-group">
                                                <input type="text" className="form-control form-control-sm w-x-4" />
                                                <span className="input-group-addon form-control-sm">坪</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="form-group">
                                <button className="btn btn-primary">搜　尋</button>
                            </div>
                            <div id="collapse-other" className="collapse">
                                <div className="card card-block">
                                    <div className="row">
                                        <div className="col-xs-3">
                                            <div className="grid">
                                                <span className="h6">房數</span>
                                                <label className="c-input c-checkbox m-b-0 m-l-1">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    含加蓋
                                                </label>
                                                <hr className="sm" />
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <span className="input-group">
                                                        <select className="form-control form-control-sm">
                                                            <option value>不限</option>
                                                            <option value>1房</option>
                                                            <option value>2房</option>
                                                            <option value>3房</option>
                                                            <option value>4房</option>
                                                            <option value>5房</option>
                                                            <option value>6房</option>
                                                        </select>
                                                        <span className="input-group-addon form-control-sm">以上</span>
                                                    </span>
                                                </label>
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">房</span>
                                                    </span>
                                                    ~
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">房</span>
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="grid">
                                                <span className="h6">屋齡</span>
                                                <hr className="sm" />
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <select className="form-control form-control-sm">
                                                        <option value>0~5年</option>
                                                        <option value>6~10年</option>
                                                        <option value>11~20年</option>
                                                        <option value>21~30年</option>
                                                        <option value>31~40年</option>
                                                        <option value>41年以上</option>
                                                    </select>
                                                </label>
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">年</span>
                                                    </span>
                                                    ~
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">年</span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="grid">
                                                <span className="h6">樓層</span>
                                                <hr className="sm" />
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <select className="form-control form-control-sm">
                                                        <option value>1樓</option>
                                                        <option value>2~7樓</option>
                                                        <option value>8~10樓</option>
                                                        <option value>11樓以上</option>
                                                    </select>
                                                </label>
                                                <label className="c-input c-radio">
                                                    <input type="radio" />
                                                    <span className="c-indicator" />
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">樓</span>
                                                    </span>
                                                    ~
                                                    <span className="input-group">
                                                        <input type="text" className="form-control form-control-sm w-x-4" />
                                                        <span className="input-group-addon form-control-sm">樓</span>
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="grid">
                                                <span className="h6">類型 <small>(可複選) </small></span>
                                                <hr className="sm" />
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    公寓
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    電梯華廈大樓
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    多樓層 (樓中樓)
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    透天厝
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    成屋
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    預售屋
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    套房
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    其他
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="grid">
                                                <span className="h6">特色 <small>(可複選) </small></span>
                                                <hr className="sm" />
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    低公設
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    近捷運
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    近學校
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    近公園
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    近市場
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    無障礙空間
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    警衛管理
                                                </label>
                                            </div>
                                            <div className="grid">
                                                <span className="h6">車位 <small>(可複選) </small></span>
                                                <hr className="sm" />
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    坡道平面
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    機械平面
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    坡道機械
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    機械機械
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    庭院
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    另租
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    其他
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="grid">
                                                <span className="h6">特殊格局 <small>(可複選) </small></span>
                                                <hr className="sm" />
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    邊間
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    頂樓
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    頂樓加蓋
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    地下室
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    地下室+1樓
                                                </label>
                                            </div>
                                            <div className="grid">
                                                <span className="h6">朝向 <small>(可複選) </small></span>
                                                <select className="form-control form-control-sm">
                                                    <option value>物件大門</option>
                                                    <option value>大樓</option>
                                                    <option value>落地窗</option>
                                                </select>
                                                <hr className="sm" />
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    東
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    南
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    西
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    北
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    東南
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    東北
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    西南
                                                </label>
                                                <label className="c-input c-checkbox">
                                                    <input type="checkbox" />
                                                    <span className="c-indicator" />
                                                    西北
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <p className="clearfix">
                        <span className="result pull-xs-left">共有<strong className="text-danger">304</strong>間房屋符合條件</span>
                        <span className="pull-xs-right form-inline">
                            <label htmlFor="">排序方式：</label>
                            <select className="form-control form-control-sm">
                                <option value>預設排序</option> @* 以後台設定的排序為主 * @
                                <option value>更新時間新 → 舊</option> @* 以資料建立時間為主 * @
                                <option value>總價低 → 高</option>
                                <option value>總價高 → 低</option>
                                <option value>坪數低 → 高</option>
                                <option value>坪數高 → 低</option>
                                <option value>屋齡低 → 高</option>
                                <option value>屋齡高 → 低</option>
                            </select>
                        </span>
                    </p>
                    <ol className="prolist row">
                        <li className="pro">
                            <article className="card">
                                <a className="card-img-top" href="/Sell/Content">
                                    <img alt="北大稀有輕豪宅" src="/Content/images/Sell/pro1.jpg" />
                                </a>
                                <div className="card-block">
                                    <h4 className="card-title"><a href="~/Sell/Content">北大稀有輕豪宅</a></h4>
                                    <section className="card-text">
                                        <h5 className="card-subtitle">高樓景觀屋況佳、格局方正採光佳</h5>
                                        <ul className="feature list-inline">
                                            <li>新北市樹林區中華路</li>
                                            <li>電梯大樓</li>
                                            <li>成屋</li>
                                            <li>坡道平面車位</li>
                                        </ul>
                                        <ul className="info list-inline">
                                            <li>49.27 <span className="text-muted">建坪</span></li>
                                            <li>29.11 <span className="text-muted">主+陽</span></li>
                                            <li>7.3 <span className="text-muted">年</span></li>
                                            <li>14/16 <span className="text-muted">樓</span></li>
                                            <li>
                                                3 <span className="text-muted">房</span>
                                                2 <span className="text-muted">廳</span>
                                                2 <span className="text-muted">衛</span>
                                                0 <span className="text-muted">室</span>
                                            </li>
                                        </ul>
                                        <span className="price">
                                            <strong className="text-danger">2, 980</strong>萬
                                        </span>
                                    </section>
                                    <a className="more btn btn-secondary" href="/Sell/Content">
                                        看更多
                                        <i className="ti-angle-right" />
                                    </a>
                                </div>
                            </article>
                        </li>
                        <li className="pro">
                            <article className="card">
                                <a className="card-img-top" href="/Sell/Content">
                                    <img alt="北大稀有輕豪宅" src="/Content/images/Sell/pro1.jpg" />
                                </a>
                                <div className="card-block">
                                    <h4 className="card-title"><a href="~/Sell/Content">北大稀有輕豪宅</a></h4>
                                    <section className="card-text">
                                        <h5 className="card-subtitle">高樓景觀屋況佳、格局方正採光佳</h5>
                                        <ul className="feature list-inline">
                                            <li>新北市樹林區中華路</li>
                                            <li>電梯大樓</li>
                                            <li>成屋</li>
                                            <li>坡道平面車位</li>
                                        </ul>
                                        <ul className="info list-inline">
                                            <li>49.27 <span className="text-muted">建坪</span></li>
                                            <li>29.11 <span className="text-muted">主+陽</span></li>
                                            <li>7.3 <span className="text-muted">年</span></li>
                                            <li>14/16 <span className="text-muted">樓</span></li>
                                            <li>
                                                3 <span className="text-muted">房</span>
                                                2 <span className="text-muted">廳</span>
                                                2 <span className="text-muted">衛</span>
                                                0 <span className="text-muted">室</span>
                                            </li>
                                        </ul>
                                        <span className="price">
                                            <strong className="text-danger">2, 980</strong>萬
                                        </span>
                                    </section>
                                    <a className="more btn btn-secondary" href="~/Sell/Content">
                                        看更多
                                        <i className="ti-angle-right" />
                                    </a>
                                </div>
                            </article>
                        </li>
                    </ol>
                </div>
            );