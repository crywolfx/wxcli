const { rcPath, localPkg } = require('../utils/path');
const { readRcFile, execAwn, getPluginPath, requirePlugin } = require('../utils/common');
const chalk = require('chalk');

const file = readRcFile(rcPath);

class PluginManager {
    constructor() {
        this.program = null;
        this.inlinePluginList = [
            '../command/create',
            '../command/dev'
        ];
        this.localPlugin = [];
        this.scriptPlugin = [];
    }
    injectPlugin(program) {
        this.program = program;
        // 权重值从低到高
        const pluginsFilter = [];
        const tempPlugin = {};
        const localPlugin = this.addLocalPlugin();
        const npmScript = this.addNpmScript();
        const inlinePlugin = this.addInlinePlugin();

        [...localPlugin, ...npmScript, ...inlinePlugin].forEach((item) => {
            const commandName = item.commandName || '';
            console.log(commandName);
            if (!tempPlugin[commandName]) {
                pluginsFilter.push(item);
                tempPlugin[commandName] = commandName;
            }
        })
        this.addPlugin(pluginsFilter);
    }
    addPlugin(pluginsList) {
        pluginsList.forEach((plugin) => {
            if (plugin.commands && plugin.commands.length > 0) {
                plugin.commands.forEach((_plugin) => {
                    this.injectItem(_plugin)
                })
            } else {
                this.injectItem(plugin)
            }
        })
    }
    injectItem(plugin) {

        if (!plugin.commandName) {
            return;
        }
        let command = this.program.command(plugin.commandName);
        if (plugin.alias) {
            command.alias(plugin.alias || '')
        }
        if (plugin.option && plugin.option.length > 0) {
            plugin.option.forEach((option) => {
                command.option(...option)
            })
        }
        if (plugin.description) {
            command.description(plugin.description)
        }
        if (plugin.action) {
            command.action(plugin.action);
        }
    }
    /**
     * 安装内置插件
     *
     * @memberof PluginManager
     */
    addInlinePlugin() {
        this.inlinePlugins = this.inlinePluginList.map((path) => {
            return require(path);
        })
        return this.inlinePlugins;
    }
    /**
     * 安装Npm命令
     *
     * @memberof PluginManager
     */
    addNpmScript() {
        const { scripts = {} } = localPkg || {};
        this.scriptPlugin = Object.keys(scripts).map((key) => {

            const script = scripts[key];
            const commandName = key;
            const description = `run wxfe ${commandName} is the same as npm run ${commandName}`;
            const action = () => {
                execAwn(`npm run ${key}`).then((res) => { console.log(res) })
            }
            return { commandName, description, action };
        })
        return this.scriptPlugin;
    }
    /**
     * 安装根目录.wxclirc文件中指定的插件
     *
     * @memberof PluginManager
     */
    addLocalPlugin() {
        const plugins = file && file.plugins || [];
        if (plugins.length > 0) {
            console.log(chalk.yellow(`正在寻找插件：${JSON.stringify([...plugins])}...`));
        }
        let pluginsList = [];
        plugins.forEach((pluginName) => {
            const plugin = requirePlugin(pluginName);
            if (plugin.commands) {
                pluginsList.push(...plugin.commands)
            } else {
                pluginsList.push(plugin);
            }
        });
        if (pluginsList.length < plugins.length) {
            console.log(chalk.red(`几款插件寻找失败，请检查`));
        } else {
            console.log(chalk.green(`插件寻找成功：${JSON.stringify([...plugins])}`));
        }
        return pluginsList;
    }
}

module.exports = new PluginManager();