import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import * as sassM from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassM);
import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fs from 'fs';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import sassGlob from 'gulp-sass-glob';
import changed from 'gulp-changed';

import config from './../webpack.config.js';


// const gulp = require('gulp');
// const fileInclude = require('gulp-file-include');
// const sass = require('gulp-sass')(require('sass'));
// const server = require('gulp-server-livereload');
// const clean = require('gulp-clean');
// const fs = require('fs');
// const sourceMaps = require('gulp-sourcemaps');
// const plumber = require('gulp-plumber');
// const notify = require('gulp-notify');

// const webpack = require('webpack-stream');
// const babel = require('gulp-babel');
// const imagemin = require('gulp-imagemin');
// const cache = require('gulp-cached');
// const sassGlob = require('gulp-sass-glob');

// const changed = require('gulp-changed');

// const groupMedia = require('gulp-group-css-media-queries');


// @@include
gulp.task('includeFiles:dev', function() {
    return gulp.src(['./src/html/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', {hasChanged: changed.compareContents}))
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'HTML',
                    message: err.message,
                    sound: false
                }
            })
        }))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
})

// Компиляция SCSS
gulp.task('sass:dev', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'SCSS',
                    message: err.message,
                    sound: false
                }
            })
        }))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        // .pipe(groupMedia())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
})

// Компиляция img
gulp.task('copyImages:dev', function() {
    return gulp.src('./src/img/**/*.+(jpg|png|ico|webp)')
        .pipe(changed('./build/img/'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./build/img/'))
})

// Компиляция svg
gulp.task('copySvg:dev', function() {
    return gulp.src('./src/svg/**/*.svg')
        .pipe(changed('./build/svg/'))
        .pipe(gulp.dest('./build/svg/'))
})

// Компиляция Шрифтов
gulp.task('fonts:dev', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
})

// Компиляция файлов
gulp.task('files:dev', function() {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'))
})

// server
gulp.task('server:dev', function() {
    return gulp.src('./build/')
        .pipe(server({
            livereload: true,
            open: true
        }))
})

// clean dist
gulp.task('clean:dev', function(done) {

    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
    }
    done();
   
})

// слежение за изменениями
gulp.task('watch:dev', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('includeFiles:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('copyImages:dev'));
    gulp.watch('./src/svg/**/*', gulp.parallel('copySvg:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
})

// Компиляция js
gulp.task('js:dev', function() {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'JS',
                    message: err.message,
                    sound: false
                }
            })
        }))
        .pipe(babel())
        .pipe(webpack(config))
        .pipe(gulp.dest('./build/js/'))
})



