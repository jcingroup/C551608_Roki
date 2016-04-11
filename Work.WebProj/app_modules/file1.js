var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JCIN = require('JCIN');
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        _super.apply(this, arguments);
    }
    Tips.prototype.render = function () {
        var ABC = JCIN.ContextComponent;
        return React.createElement("div", null, React.createElement(ABC, {"id": 1}));
    };
    return Tips;
})(React.Component);
