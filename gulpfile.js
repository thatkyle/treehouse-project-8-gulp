'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const maps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const del = require('del');
const webserver = require('gulp-webserver');

gulp.task('concatScripts', function() {
  return gulp.src([
      'js/global.js',
      'js/circle/autogrow.js',
      'js/circle/circle.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src('js/all.js')
    .pipe(uglify({ mangle: false }))
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts', ['minifyScripts']);

gulp.task('compileSass', function() {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('minifyCss', ['compileSass'], function() {
  return gulp.src('css/global.css')
    .pipe(uglifycss())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('styles', ['minifyCss']);

gulp.task('images', function() {
  return gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function() {
  del(['dist/*', 'dist/', 'css/application.css*', 'js/app.*.js*']);
});

gulp.task('all', ['scripts', 'styles', 'images'], function() {
  return gulp.src(['index.html', 'icons/**'], { base: './'})
                .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean'], function() {
  gulp.start('all');
});

gulp.task('webserver', ['build', 'all'], function() {
  gulp.src('dist')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 3000,
      livereload: true,
      open: true,
      fallback: 'index.html'
    }));
});

gulp.task('default', ['webserver']);
