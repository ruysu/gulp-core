var gulp = require('gulp'),
    beautify = require('gulp-jsbeautify'),
    file = require('gulp-file'),
    notify = require('gulp-notify'),
    filenames = require('gulp-filenames'),
    merge = require('merge-stream');

module.exports = function (filename, dest, main) {
    return function () {
        if (typeof filename == 'object') {
            main = filename;
            filename = 'main.js';
        }

        if (typeof dest == 'object') {
            main = dest;
            dest = null;
        }

        var all_files = filenames.get("all"),
            packages = [],
            files;

        for (var packageName in all_files) {
            packages.push(packageName);
        }

        packages = packages.sort()

        main.paths = {};

        for (var i in packages) {
            files = filenames.get(packages[i]);

            if (files.length > 1) {
                main.paths[packages[i]] = 'vendor/' + packages[i];
            }
            else {
                main.paths[packages[i]] = 'vendor/' + files[0].replace(/\.js$/, '');
            }
        }

        var main_str = 'require.config(' + JSON.stringify(main) + ');';

        return file(filename, main_str, {src: true})
            .pipe(beautify({indentSize: 4}))
            .pipe(gulp.dest(dest || 'src/js'))
            .pipe(notify({message: 'Main file generated!', onLast: true}));
    }
};