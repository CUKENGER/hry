import gulp from 'gulp';
// html
import fileInclude from 'gulp-file-include';
import htmlclean from 'gulp-htmlclean';
import webpHTML from 'gulp-webp-html';
// scss
import * as sassM from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassM);
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import webpCSS from 'gulp-webp-css';

import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fs from 'fs';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
// images
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

import sassGlob from 'gulp-sass-glob';
import changed from 'gulp-changed';
import groupMedia from 'gulp-group-css-media-queries';



import config from '../webpack.config.js';


// @@include
gulp.task('includeFiles:docs', function() {
    return gulp.src(['./src/html/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
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
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
})

// Компиляция SCSS
gulp.task('sass:docs', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
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
        .pipe(autoprefixer())
        .pipe(sassGlob())
        // .pipe(webpCSS())
        // .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'))
})

// Компиляция img
gulp.task('copyImages:docs', function() {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        // .pipe(gulp.src('./src/img/**/*'))
        // .pipe(changed('./docs/img/'))
        // .pipe(imagemin({verbose: true}))
        // .pipe(gulp.dest('./docs/img/'))
})

// Компиляция svg
gulp.task('copySvg:docs', function() {
    return gulp.src('./src/svg/**/*.svg')
        .pipe(changed('./docs/svg/'))
        .pipe(gulp.dest('./docs/svg/'))
})

// Компиляция Шрифтов
gulp.task('fonts:docs', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
})

// Компиляция файлов
gulp.task('files:docs', function() {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'))
})

// server
gulp.task('server:docs', function() {
    return gulp.src('./docs/')
        .pipe(server({
            livereload: true,
            open: true
        }))
})

// clean dist
gulp.task('clean:docs', function(done) {

    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
    }
    done();
   
})


// Компиляция js
gulp.task('js:docs', function() {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
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
        .pipe(gulp.dest('./docs/js/'))
})



