var gulp = require('gulp'),
    gutils = require('gulp-util'),
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    path = require('path'),
    merge = require('merge-stream');

module.exports = function (dest) {
    return function () {
        var 
            bower_components = require('bower-files')({camelCase: false}),
            images = bower_components.ext(['png', 'jpg', 'gif', 'jpeg']).deps,
            tasks = [];

        for (var packageName in images) {
            if (images[packageName].length) {
                tasks.push(
                    gulp.src(images[packageName])
                        .pipe(gulpif(gutils.env.production, imagemin()))
                        .pipe(gulp.dest(path.join(dest || 'img/vendor', packageName)))
                );
            }
        }

        return merge.apply(this, tasks)
            .pipe(notify({message: 'Published images!', onLast: true}));
    }
};