var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gutils = require('gulp-util');

module.exports = function (src, out, dest) {
    return function () {
        var shouldUglify = function () {
            return gutils.env.production;
        };

        var appendMin = function () {
            return Boolean(gutils.env.production && gutils.env.min);
        }

        return gulp.src(src)
            .pipe(gulpif(shouldUglify, uglify()))
            .pipe(gulpif(appendMin, rename({suffix: '.min'})))
            .pipe(concat(out || 'app.js'))
            .pipe(gulp.dest(dest || 'js'))
            .pipe(notify('Compiled: <%= file.relative %>!'));
    };
};