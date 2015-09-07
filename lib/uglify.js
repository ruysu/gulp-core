var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    gutils = require('gulp-util');

module.exports = function (src, dest, options) {
    if (typeof dest == 'object') {
        options = dest;
        dest = null;
    }

    if (typeof options == 'undefined') {
        options = {};
    }

    if (typeof options.compress == 'undefined' && !gutils.env.production) {
        options.compress = false;
    }

    return function () {
        var appendMin = function () {
            return Boolean(gutils.env.production && gutils.env.min);
        }

        return gulp.src(src)
            .pipe(uglify(options).on('error', notify.onError('<%= error.message %>')))
            .pipe(gulpif(appendMin, rename({suffix: '.min'})))
            .pipe(gulp.dest(dest || 'css'))
            .pipe(notify({message: 'Uglified scripts!', onLast: true}));
    };
};