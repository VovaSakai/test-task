var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		less           = require('gulp-less'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		rigger         = require('gulp-rigger'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require('gulp-notify');

gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/jquery.min.js',
		'src/js/common.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('less', function() {
	return gulp.src('src/less/**/*.less')
	.pipe(less())
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['less', 'scripts', 'browser-sync'], function() {
	gulp.watch('src/less/**/*.less', ['less']);
	gulp.watch(['libs/**/*.js', 'src/js/common.js'], ['scripts']);
	gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('build/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'less', 'scripts'], function() {

	var buildFiles = gulp.src([
		'src/*.html'
  ]).pipe(rigger())
  .pipe(gulp.dest('build'));

	var buildCss = gulp.src([
		'src/css/main.min.css',
		]).pipe(gulp.dest('build/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js'
		]).pipe(gulp.dest('build/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*'
    ]).pipe(gulp.dest('build/fonts'));

});

gulp.task('removedist', function() { return del.sync('build'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
