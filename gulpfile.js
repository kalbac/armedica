/**
 * Created by admin on 03.01.2018.
 */

'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync')
var pug = require('gulp-pug')
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')
var uglify = require('gulp-uglify')
var cache = require('gulp-cache')
var csso = require('gulp-csso')
var del = require('del')
var runSequence = require('run-sequence')
var spritesmith = require('gulp.spritesmith')
var merge = require('merge-stream')
var ghPages = require('gulp-gh-pages')

gulp.task('serv', function(){
    browserSync( { server: { baseDir: 'dist' } } )
}).task('sass', function() {
    return gulp.src('src/sass/**/*.+(sass|scss)')
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9' ) )
        .pipe( csso() )
        .pipe( gulp.dest( 'dist/css' ) )
        .pipe( browserSync.reload( { stream: true } ) )
}).task('pug', function(){
    gulp.src('src/pug/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))
        .pipe( browserSync.reload( { stream: true } ) )
}).task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe( browserSync.reload( { stream: true } ) )
}).task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe( browserSync.reload( { stream: true } ) )
}).task('sprite', function () {
    var spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));
    var imgStream = spriteData.img
        .pipe(gulp.dest('src/img/'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/sprite/'));
    return merge(imgStream, cssStream);
}).task('watch', function() {
    gulp.watch('src/sass/**/*.+(sass|scss)', ['sass']);
    gulp.watch('src/pug/**/*.+(jade|pug)', ['pug']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/**/*', ['img']);
    gulp.watch('src/sprite/**/*.png', ['sprite']);
}).task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return cache.clearAll(cb);
    });
}).task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
}).task('default', function(callback) {
    runSequence(['watch', 'sass', 'serv', 'sprite', 'img', 'js', 'pug'],
        callback
    )
}).task('build', function( callback ) {
    runSequence(
        'clean:dist',
        ['pug', 'js', 'img'],
        callback
    )
}).task('deploy', function() {
    return gulp.src('dist/**/*')
        .pipe(ghPages({
            remoteUrl: 'https://github.com/kalbac/armedica.git',
            origin:'origin',
            branch:'master',
            //branch:'build'
        }));
})

