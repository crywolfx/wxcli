const net = require('net');
const path = require('path');
const { exec, spawn, execSync } = require('child_process');
const chalk = require('chalk');
const JSON5 = require('json5');
const fs = require('fs');

const isWin = process.platform === 'win32';
/**
 * 打开浏览器
 *
 * @param {*} url
 */
const openBrowser = (url) => {
    // 拿到当前系统的参数
    switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
        case "darwin":
            exec(`open ${url}`);
            break;
        //win系统使用 一下命令打开url在浏览器
        case "win32":
            exec(`start ${url}`);
            break;
        // 默认mac系统
        case 'linux':
            exec(`xdg-open ${url}`);
            break;
        default:
            exec(`open ${url}`);
            break;
    }
}

/**
 * 检查可用端口
 *
 * @param {number} port
 * @returns
 */
const portInUsed = (port) => {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port);
        server.on('listening', function () {
            server.close();
            resolve(port);
        });
        server.on('error', function (err) {
            if (err.code == 'EADDRINUSE') {
                port++;
                if (port > 10000) {
                    reject(err);
                } else {
                    return portInUsed(port);
                }
            }
        });
    })
}

/**
 * 确实参数 文字提醒
 *
 * @param {*} argsName
 * @param {*} callback
 */
const missArgument = (argsName, callback) => {
    chalk.red(`Missing required arguments ${chalk.yellow(argsName)}.`);
    callback && callback();
}

/**
 * 读取rc文件
 *
 * @param {string} pth
 * @returns
 */
const readRcFile = (pth) => {
    let content;
    try {
        if (fs.existsSync(pth)) {
            content = JSON5.parse(fs.readFileSync(pth).toString());
        } else {
            content = null;
        }
    } catch (err) {

    }

    return content;
}

const execAwn = (args, cwd = process.cwd()) => {
    return new Promise((resolve, reject) => {
        if (!args) {
            return reject();
        }
        const agrArray = args.split(' ').map(cmds => cmds.trim());;
        const command = agrArray.splice(0, 1);
        const shell = spawn(command[0] || '', agrArray || [], {
            stdio: 'inherit',
            cwd,
            shell: isWin
        });
        console.log(chalk.green(`command run in ${cwd}`))
        let stdoutData;
        let stderrData;

        shell.stdout.on('data', (data) => {
            stdoutData = data && data.toString();
        });

        shell.stderr.on('data', (data) => {
            stderrData = data && data.toString();
        });

        shell.on('close', code => {
            if (code === 0) return resolve({ success: true, stdoutData, stderrData });
            return reject(new Error(`error with status code: ${code}`));
        });
    })
}

const getGlobalModulesPath = () => {
    let yarnBinRoot, npmBinRoot;
    function getPath() {
        if (!yarnBinRoot || !npmBinRoot) {
            yarnBinRoot = execSync('yarn global bin').toString().replace(/\n/, '');
            npmBinRoot = execSync('npm root -g').toString().replace(/\n/, '');
        }
        return { yarnBinRoot, npmBinRoot }
    }
    return getPath();
}


const localNodeModulesPath = () => {
    const localCwdPath = process.cwd();
    const npmLocal = path.resolve(localCwdPath, './node_modules');
    return { npmLocal };
}

const getPluginPath = (pluginName) => {
    const { yarnBinRoot, npmBinRoot } = getGlobalModulesPath();
    const { npmLocal } = localNodeModulesPath();

    const localPluginPath = path.resolve(npmLocal, `./${pluginName}`);
    const npmRootPlugin = path.resolve(npmBinRoot, `./${pluginName}`);
    const yarnRootPlugin = path.resolve(yarnBinRoot, `./${pluginName}`);
    return { localPluginPath, npmRootPlugin, yarnRootPlugin }
}

const requirePlugin = (pluginName) => {
    if (!pluginName) {
        return null;
    }
    const { localPluginPath, npmRootPlugin, yarnRootPlugin } = getPluginPath(pluginName);
    if (fs.existsSync(localPluginPath)) {
        return require(localPluginPath);
    } 
    if (fs.existsSync(npmRootPlugin)) {
        return require(npmRootPlugin);
    }
    if (fs.existsSync(yarnRootPlugin)) {
        return require(yarnRootPlugin);
    }
}


module.exports = { openBrowser, portInUsed, missArgument, readRcFile, execAwn, isWin, getGlobalModulesPath, localNodeModulesPath, getPluginPath, requirePlugin };