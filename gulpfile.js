const {src, dest, watch, parallel, series} = require('gulp'),
    scss = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify-es').default,
    autopefixer = require('gulp-autoprefixer'); // для поддержки старыми браузерами 
del = require('del');

function scripts(){ // работа с js файлами
    return src([
        'node_modules/jquery/dist/jquery.js', //выбираем jquery библиотеку
        'app/js/main.js' // выбираем основной файл main.js
  ])
  .pipe(concat('main.min.js')) // переименовывем файл в min.js
  .pipe(uglify()) // минифицируем 
  .pipe(dest('app/js')) //переносим в app/js
  .pipe(browserSync.stream()) // для слежки
}

function browsersync(){ // обновление браузера
  browserSync.init({
    server : {
      baseDir: 'app/' // папка с проектом
    }
  })
}

function styles(){ // конвертирует из scss в css
  return src(['app/scss/_nullstyle.scss', 'app/scss/style.scss'])
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(autopefixer({ // добавление префикса 
      overrideBrowserlist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching(){ // слежение за файлом
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts); // \! исключаем файл min.js, оставляем слежку за остальными js файлами 
  watch(['app/*.html']).on('change', browserSync.reload) // слежка за html файлами
}

function cleanDist(){
  return del('dist');
}

function build(){
  return src([
    'app/css/style.min.css',
    'app.fonts/**/*',
    'app/js/main.min.js',
    'app/*.html'
  ], {base: 'app'}) // базовая директория (чтобы правильно пути были)
  .pipe(dest('dist'))
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;
exports.lintJS = lintJS;

exports.default = parallel(styles, scripts, browsersync, watching); // при запуске gulp 

exports.build = series(cleanDist, build); // сначала удаляем папку dist, потом билдим