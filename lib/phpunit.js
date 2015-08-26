var gulp = require('gulp'),
    notify = require('gulp-notify'),
    phpunit = require('gulp-phpunit');

function testNotification(status) {
    var options = {
        title:   (status == 'pass') ? 'Tests Passed' : 'Tests Failed',
        message: (status == 'pass') ? '\n\nAll tests have passed!\n\n' : '\n\nOne or more tests failed...\n\n'
    };

    return options;
}

module.exports = function (src, bin, options) {
    if (typeof bin == 'object') {
        options = bin;
        bin = null;
    }

    if (typeof options == 'undefined') {
        options = {};
    }

    return function () {
        return gulp.src(src || 'phpunit.xml')
            .pipe(phpunit(bin || 'phpunit', options))
            .on('error', notify.onError(testNotification('fail')))
            .pipe(notify(testNotification('pass')));
    };
};