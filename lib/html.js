var gulp = require('gulp'),
    notify = require('gulp-notify'),
    minify = require('gulp-html-minify');

module.exports = function (src, dest, options) {
    if (typeof dest == 'object') {
        options = dest;
        dest = null;
    }

    if (typeof options == 'undefined') {
        options = {};
    }

    return function () {
        return gulp.src(src)
            .pipe(minify(options).on('error', notify.onError('<%= error.message %>')))
            .pipe(gulp.dest(dest || 'html'))
            .pipe(notify({message: 'Minified html files!', onLast: true}));
    };
};