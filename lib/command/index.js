"use strict";

var program = require('commander');

var _require = require('../utils'),
    filePath = _require.filePath;

var version = filePath.pkg.version;
program.version(version, '-v, --version', '查看版本');
program.name("wxfe").usage('<command> [options]');
program.command('hello', 'hello');
program.parse(process.argv);