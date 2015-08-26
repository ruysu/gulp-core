var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
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

    return function () {
        var minify = function () {
            return gutils.env.production;
        };

        var appendMin = function () {
            return Boolean(gutils.env.production && gutils.env.min);
        }

        return gulp.src(src)
            .pipe(less(options).on('error', notify.onError('<%= error.message %>')))
            .pipe(gulpif(minify, cssmin()))
            .pipe(gulpif(appendMin, rename({suffix: '.min'})))
            .pipe(gulp.dest(dest || 'css'))
            .pipe(notify('Compiled: <%= file.relative %>!'));
    };
};