"use strict";

var _require = require('child_process'),
    exec = _require.exec;

var openBrowser = function openBrowser(url) {
  // 拿到当前系统的参数
  switch (process.platform) {
    //mac系统使用 一下命令打开url在浏览器
    case "darwin":
      exec("open ".concat(url));
      break;
    //win系统使用 一下命令打开url在浏览器

    case "win32":
      exec("start ".concat(url));
      break;
    // 默认mac系统

    case 'linux':
      exec("xdg-open ".concat(url));
      break;

    default:
      exec("open ".concat(url));
      break;
  }
};

module.exports = openBrowser;