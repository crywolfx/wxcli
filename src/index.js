
const Koa = require('koa');
const koaView = require('koa-view');
const koaStatic = require('koa-static');
const path = require('path');
const { baseHost } = require('./config');
const chalk = require('chalk');
const { openBrowser, portInUsed } = require('./utils');

class App {
    constructor() {
        this.koa = new Koa();
        this.init();
    }
    static getInstance() {
        if (!this.app) {
            this.app = new App();
        }
        return this.app;
    }
    init() {
        this.addMiddleWare();
        this.run();
    }
    async addMiddleWare() {
        this.koa.use(koaStatic(path.join(__dirname, "./views")));
        const port = await portInUsed(baseHost.port);
        this.koa.listen(port);
    }
    run() {
        const url = `${baseHost.host}:${baseHost.port}`;
        console.log(chalk.green(`项目启动：${baseHost.host}:${baseHost.port}, 即将打开浏览器`));
        openBrowser(url);
    }
}

const app = App.getInstance();

module.exports = App;