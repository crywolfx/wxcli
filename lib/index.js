"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Koa = require('koa');

var koaView = require('koa-view');

var koaStatic = require('koa-static');

var path = require('path');

var _require = require('./config'),
    baseHost = _require.baseHost;

var chalk = require('chalk');

var _require2 = require('./utils'),
    openBrowser = _require2.openBrowser;

var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);

    this.koa = new Koa();
    this.init();
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      this.addMiddleWare();
      this.run();
    }
  }, {
    key: "addMiddleWare",
    value: function addMiddleWare() {
      this.koa.use(koaStatic(path.join(__dirname, "./views")));
      this.koa.listen(baseHost.port);
    }
  }, {
    key: "run",
    value: function run() {
      var url = "".concat(baseHost.host, ":").concat(baseHost.port);
      console.log(chalk.green("\u9879\u76EE\u542F\u52A8\uFF1A".concat(baseHost.host, ":").concat(baseHost.port, ", \u5373\u5C06\u6253\u5F00\u6D4F\u89C8\u5668")));
      openBrowser(url);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!this.app) {
        this.app = new App();
      }

      return this.app;
    }
  }]);

  return App;
}();

var app = App.getInstance();
module.exports = App;