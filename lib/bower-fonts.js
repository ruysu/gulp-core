var gulp = require('gulp'),
    notify = require('gulp-notify'),
    path = require('path'),
    merge = require('merge-stream');

module.exports = function (dest) {
    return function () {
        var 
            bower_components = require('bower-files')({camelCase: false}),
            fonts = bower_components.ext(['eot', 'woff', 'woff2', 'ttf', 'svg']).deps,
            tasks = [];

        for (var packageName in fonts) {
            if (fonts[packageName].length) {
                tasks.push(
                    gulp.src(fonts[packageName])
                        .pipe(gulp.dest(path.join(dest || 'fonts', packageName)))
                );
            }
        }

        return merge.apply(this, tasks)
            .pipe(notify({message: 'Published fonts!', onLast: true}));
    }
};