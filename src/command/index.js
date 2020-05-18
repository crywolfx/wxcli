const program = require('commander');
const didYouMean = require('didyoumean');
const chalk = require('chalk');
const { filePath } = require('../utils');
const pluginsManager = require('../manager/pluginsManager');
const version = filePath.pkg.version;

class Start {
    constructor() {
        this.program = program;
        this.plugins = [];
        this.init();
    }
    init() {
        this.addInfo();
        this.addSuggestCommands();
        this.addCommand();
        this.args = this.program.parse(process.argv);
    }
    addInfo () {
        this.program.version(version, '-v, --version', 'output the version number');
        this.program.name('wxfe').usage('<command> [options]');
        this.program.helpOption('-h, --HELP', 'show all commands');
    }
    /**
     * 添加命令
     *
     * @memberof Start
     */
    addCommand() {
        pluginsManager.injectPlugin(this.program);
    }

    /**
     * 添加命令提示
     *
     * @memberof Start
     */
    addSuggestCommands() {
        this.program
            .arguments('<command>')
            .action((cmd) => {
                this.program.outputHelp();
                console.log(`\n  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
                this.suggestCommands(cmd);
            });
    }
    suggestCommands(cmd) {
        const availableCommands = this.program.commands.map(cmd => {
            return cmd._name;
        });

        const suggestion = didYouMean(cmd, availableCommands);
        if (suggestion) {
            if (typeof suggestion === 'string') {
                console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
            } else {
                console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion.join(', '))}?`));
            }
        }
    }
}

new Start();