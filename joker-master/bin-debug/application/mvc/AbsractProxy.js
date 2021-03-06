var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var mvc;
    (function (mvc) {
        /**
         *
         * @author
         *
         */
        var AbsractProxy = (function (_super) {
            __extends(AbsractProxy, _super);
            function AbsractProxy(proxyName, data) {
                return _super.call(this, proxyName, data) || this;
            }
            AbsractProxy.prototype.onRegister = function () {
                _super.prototype.onRegister.call(this);
                if (this.childs != null) {
                    for (var i = 0; i < this.childs.length; ++i) {
                        var proxyType = this.childs[i];
                        var proxy = new proxyType(proxyType.NAME, this.getData());
                        proxy.parent = this;
                        app.mvc.AppFacade.getInstance().registerProxy(proxy);
                    }
                }
            };
            AbsractProxy.prototype.onRemove = function () {
                _super.prototype.onRemove.call(this);
                if (this.parent != null)
                    this.parent = null;
                if (this.childs != null) {
                    for (var i = 0; i < this.childs.length; ++i) {
                        app.mvc.AppFacade.getInstance().removeProxy(this.childs[i].NAME);
                    }
                    this.childs = null;
                }
            };
            AbsractProxy.prototype.getData = function () {
                return this.parent == null ? _super.prototype.getData.call(this) : this.parent.getData();
            };
            AbsractProxy.prototype.dispose = function () {
            };
            return AbsractProxy;
        }(puremvc.Proxy));
        mvc.AbsractProxy = AbsractProxy;
        __reflect(AbsractProxy.prototype, "app.mvc.AbsractProxy", ["gameabc.IDisposer"]);
    })(mvc = app.mvc || (app.mvc = {}));
})(app || (app = {}));
//# sourceMappingURL=AbsractProxy.js.map