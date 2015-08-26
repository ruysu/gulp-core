var fs = require('fs'),
    path = require('path'),
    tasks = fs.readdirSync(path.join(__dirname, 'lib')),
    Core = new Object,
    taskName;

for (var i = 0; i < tasks.length; i++) {
    if (
        /\.js$/.test(tasks[i]) && 
        fs.lstatSync(path.join(__dirname, 'lib', tasks[i])).isFile()
    ) {
        taskName = tasks[i]
            .replace(/\.js$/, '')
            .replace(/[\s-]+(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/[\s-]+/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); });

        Core[taskName] = require('./lib/' + tasks[i]);
    }
};

module.exports = Core;
