var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path');

module.exports = function (src, dest) {
    var parseDir = function (file) {
            if (fs.lstatSync(src).isDirectory()) {
                file = path.join(file, '**/*');
            }

            return file;
        };

    return function () {
        if (Array.isArray(src)) {
            src.map(parseDir);
        }
        else {
            src = parseDir(src);
        }

        gulp.src(src)
            .pipe(gulp.dest(dest));
    }
};