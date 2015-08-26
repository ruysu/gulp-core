var gulp = require('gulp'),
    bower_components = require('bower-files')({camelCase: false}),
    exists = require('path-exists').sync,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    gutils = require('gulp-util'),
    file = require('gulp-file'),
    rename = require('gulp-rename'),
    filenames = require('gulp-filenames'),
    merge = require('merge-stream');

module.exports = function (dest) {
    return function () {
        var getMinifiedScripts = function (path, index, arr) {
                var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
                return exists( newPath ) ? newPath : path;
            },
            isNotMinified = function(file) {
                var filename = file.history[file.history.length - 1];
                return !(/\.min\.js$/.test(filename));
            },
            shouldUglify = function(file) {
                var uglify = isNotMinified(file) && gutils.env.production;
                // console.log('shouldUglify', uglify);
                return uglify;
            },
            jsfiles = bower_components.ext('js').deps,
            tasks = [],
            createFolder;

        for (var packageName in jsfiles) {
            if (jsfiles[packageName].length) {
                jsfiles[packageName].map(getMinifiedScripts);
                createFolder = jsfiles[packageName].length > 1;
                packageNameSafe = packageName.replace(/\.js$/, '');

                tasks.push(
                    gulp.src(jsfiles[packageName])
                        .pipe(gulpif(shouldUglify, uglify()))
                        .pipe(gulpif(createFolder, rename(function(path) {
                            path.basename = path.basename.replace(/\.min$/, '');
                        })))
                        .pipe(gulpif(createFolder, rename({dirname: packageNameSafe})))
                        .pipe(gulpif(!createFolder, rename({basename: packageNameSafe})))
                        .pipe(gulpif(shouldUglify, rename({suffix: '.min'})))
                        .pipe(filenames(packageNameSafe))
                        .pipe(gulp.dest(dest || 'js/vendor'))
                );
            }
        }

        return merge.apply(this, tasks);
    }
};