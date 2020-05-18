class Create {
    constructor () {
        this.commandName = 'create <projectName>';
        this.description = 'create project';
    }
    action (source, destination) {
        console.log("run action");
    }   
}


module.exports = new Create();