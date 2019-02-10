var gulp = require('gulp'),
	connect = require('gulp-connect'),
	replace = require('gulp-html-replace'),
	includer = require('gulp-htmlincluder'),//HTML
	livereload = require('gulp-livereload'),//Обновить изменения
	spritecreator = require('gulp.spritesmith'),//SPRITE
	less = require('gulp-less'),//LESS
	htmlmin = require('gulp-htmlmin'),//min HTML
	cleanCSS = require('gulp-clean-css'),//min CSS
	uglify = require('gulp-uglify'),//min JS
	pump = require('pump'),//доп к min JS
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	browserSync = require('browser-sync'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	gutil = require('gulp-util');

/********************** BABEL *************************/
gulp.task('babel', () =>
    gulp.src('dev/js/dev/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dev/js/build'))
);

gulp.task('es6', function() {
	browserify({
    	entries: 'dev/js/build/main.js',
    	debug: true
  	})
    .transform(babelify)
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('main.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('watch',function() {
	gulp.watch('dev/js/build/main.js',['es6'])
});
/********************** SPRITE *************************/
gulp.task('sprite', function(){
	gulp.src('dev/img/sprite/*.png')
	.pipe(spritecreator({
		imgName: 'build/img/sprite.png', //Имя спрайта
		cssName: 'dev/less/import/sprite.less', //Css Имя на выходе
		cssFormat: 'less', //Формат
		algoritm: 'binary-tree', //алгоритм
		padding: 25 //Отступ
	})).pipe(gulp.dest('./')); //Куда сохранять
});

/********************** SERVER *************************/
gulp.task('server', function(){
	browserSync.init({
		server : { baseDir: './build/'
		},
		browser: 'chrome',
		notify: false
	});
	//gulp.watch('build/**/*.js').on('change', browserSync.reload);
});

/********************** LESS *************************/
gulp.task('css', function(){
	gulp.src('dev/less/style.less')
		.pipe(less(''))
		.pipe(gulp.dest('build/css/'))
	    .pipe(connect.reload());
});

/********************** MIN CSS *************************/
gulp.task('minCss', () => {
  return gulp.src('build/css/style.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css/'));
});

/********************** HTML INCLUDER *************************/
gulp.task('html', function(){
	gulp.src('dev/**/*.html')
		.pipe(includer())
	    .pipe(replace({
		    css: 'css/style.css'
	}))
		.pipe(gulp.dest('build/'))
	    .pipe(connect.reload());
});

/********************** MIN HTMLD *************************/
gulp.task('minHtml', function() {
  return gulp.src('build/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'));
});

/********************** MIN JS *************************/
gulp.task('minJS', function (cb) {
  pump([
        gulp.src('build/js/main.js'),
        uglify(),
        gulp.dest('build/js/')
    ],
    cb
  );
});

/********************** AUTOPREFIXER *************************/
gulp.task('autoprefixer', () =>
    gulp.src('build/css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css/'))
);

/********************** GULP START *************************/
gulp.task('default', function(){
	gulp.start('css', 'autoprefixer', 'babel', ['watch'], 'html', 'server');
	
	
	gulp.watch(['dev/less/**/*.less'], function(){
		gulp.start('css');
	});
	
	gulp.watch(['dev/js/dev/*.js'], function(){
		gulp.start('babel');
	});
	
	gulp.watch(['build/css/**/*.css'], function(){
		gulp.start('autoprefixer');
	});
	
	//gulp.watch(['build/css/**/*.css'], function(){
		//gulp.start('minCss');
	//}); //Запуск MIN CSS
	
	gulp.watch(['dev/**/*.html'], function(){
		gulp.start('html');
	});
	
	//gulp.watch(['build/js/main.js'], function(){
	//	gulp.start('js'); //Запуск MIN JS
	//});
	
	//gulp.watch(['build/**/*.html'], function(){
		//gulp.start('minHtml');
	//});//Запуск MIN HTML
});