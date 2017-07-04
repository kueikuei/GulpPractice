var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var babel = require('gulp-babel');
var mainBowerFiles = require('main-bower-files');
// var concat = require('gulp-concat');
var minimist= require('minimist');
// var imageMin = require('image-min');

//gulp cope file to dir
//copy_HTML為cmd到時候下的function指令
gulp.task('copy_HTML',function(){
	return gulp.src('./source/index.html')
	.pipe(gulp.dest('./public/'))
});

//dev environment
var envOptions = {
	string: 'env',
	default: {env:'develop'}
}

//minimist
var options = minimist(process.argv.slice(2),envOptions);
console.log(options);

//compile jade
gulp.task('jade',function(){
	gulp.src('./source/jade_test.jade')
	.pipe($.plumber()) //by plumber to prevent watching stop
	.pipe($.jade({
		pretty: true //好讀版
	}))
	.pipe(gulp.dest('./public/'))
});

//compile sass
gulp.task('sass',function(){
	return gulp.src('./source/css/sass_test.css')
	.pipe($.sass().on('error',$.sass.logError))
	.pipe($.if(options.env==='production',$.minifyCss()))
	.pipe(gulp.dest('./public/css'));
});

//compile ES6
gulp.task('ES6', () => {
    return gulp.src('./source/js/**/*.js')
        .pipe($.babel({//by load-plugins to insert babel and compile
            presets: ['es2015']
        }))
        .pipe($.concat('all.js'))
        .pipe(gulp.dest('./public/js'));
});

//compress img file
gulp.task('image-min',function(){
	gulp.src('./source/images/*')
		// .pipe($.imagemin())
		.pipe($.if(options.env === 'production',$.imagemin()))
		.pipe(gulp.dest('./public/images'))
})

//watching single file
// gulp.task('watch',function(){
// 	gulp.watch('./source/sass_test.sass',['sass']);
// })

//multi watching file
gulp.task('watch',function(){
	gulp.watch('./source/jade_test.jade',['jade']);
	gulp.watch('./source/sass_test.sass',['sass']);
})

//multi task
gulp.task('default',['jade','sass','ES6','watch','image-min']);

//main bower files
gulp.task('bower',function(callback){
	return gulp.src(mainBowerFiles())
		.pipe(gulp.dest('./.tmp/vendors'))
		callback()
});

//產生出vendors後再做concat、uglify等等
gulp.task('vendorJs',['bower'],function(){
	return gulp.src('.tmp/vendors/**/**.js')
	.pipe($.concat('vendor.js'))
	.pipe($.uglify())
	.pipe(gulp.dest('./public/js'));
});




