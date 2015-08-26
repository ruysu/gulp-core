var gulp = require('gulp'),
    del = require('del');

module.exports = function (dirs) {
    return function (cb) {
        del(dirs, cb);
    }
};