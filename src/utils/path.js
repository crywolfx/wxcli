const path = require('path');
const fs = require('fs');

const { rcName } = require('../config/index');
const cwd = process.cwd();
const pkg = require('../../package.json');
const rcPath = path.resolve(cwd, rcName);
const localPkgPath = path.resolve(cwd, './package.json');
const yarnLock = path.resolve(cwd, './yarn.lock');
const npmLock = path.resolve(cwd, './package-lock.json');
const localPkg = fs.existsSync(localPkgPath) && require(localPkgPath) || {};

const isYarn = fs.existsSync(yarnLock) && !fs.existsSync(npmLock) ? true : false;

module.exports = { pkg, localPkg, cwd, rcPath, isYarn }
