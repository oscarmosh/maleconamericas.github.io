
var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		jeet = require('jeet'),
		rupture = require('rupture'),
		browserSync = require('browser-sync'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		jshint = require('gulp-jshint'),
		header  = require('gulp-header'),
		rename = require('gulp-rename'),
		minifyCSS = require('gulp-minify-css'),
		package = require('./package.json');


var banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');

gulp.task('css', function () {
		return gulp.src('src/stylus/style.styl')
		.pipe(stylus({
	      use: nib(),
	      use: jeet(),
	      use: rupture(),
	      compress: true
	    }))
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
	gulp.src('src/js/scripts.js')
		// .pipe(jshint('.jshintrc'))
		// .pipe(jshint.reporter('default'))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(uglify())
		.pipe(header(banner, { package : package }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
		browserSync.init(null, {
				server: {
						baseDir: "app"
				}
		});
});

gulp.task('bs-reload', function () {
		browserSync.reload();
});


gulp.task('default', ['css', 'js', 'browser-sync'], function () {
		gulp.watch("src/scss/*/*.scss", ['css']);
		gulp.watch("src/js/*.js", ['js']);
		gulp.watch("app/*.html", ['bs-reload']);
});