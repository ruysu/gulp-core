var gulp = require('gulp'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin');

module.exports = function (src, dest) {
    return function () {
        return gulp.src(src)
            .pipe(imagemin().on('error', notify.onError('<%= error.message %>')))
            .pipe(gulp.dest(dest || 'img'))
            .pipe(notify({message: 'Minified images!', onLast: true}));
    }
};