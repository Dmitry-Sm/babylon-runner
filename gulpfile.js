const
  gulp = require('gulp'),
  browserSync = require('browser-sync'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  smoosher = require('gulp-smoosher'),
  plumber = require('gulp-plumber'),
  del = require('del');


const path = {
  indexSrc: 'src/*.html',
  sassSrc: 'src/sass/**/*.scss',
  jsSrc: 'src/js/**/*.js',
  fxSrc: 'src/*.fx',
}


gulp.task('index', () => {
  gulp.src(path.indexSrc)
  .pipe(plumber())
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream())
})

gulp.task('css', () =>
  gulp.src(path.sassSrc)
  .pipe(plumber())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 7 versions']
  }))
  .pipe(rename('style.css'))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream())
)

gulp.task('fx', () =>
  gulp.src(path.fxSrc)
  .pipe(plumber())
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream())
)

gulp.task('js', () => {
  gulp.src(path.jsSrc)
    .pipe(plumber())
    .pipe(webpackStream({
      output: {
        filename: 'app.js',
      },
      module: {
        rules: [{
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['env']
          }
        }]
      },
      externals: {
        // jquery: 'jQuery'
      }
    }))
    .pipe(gulp.dest('build'))
    // .pipe(uglify())
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    // .pipe(gulp.dest('prod'))
    .pipe(browserSync.stream())
})


gulp.task('clean', () => {
  del('build')
})

gulp.task('browser-sync', () =>
  browserSync({
    server: {
      baseDir: 'build'
    },
    port: 8081,
    open: true,
    notify: false
  })
)

gulp.task('default', ['index', 'css', 'js', 'browser-sync'], () => {
  gulp.watch(path.indexSrc, ['index'])
  gulp.watch(path.sassSrc, ['css'])
  gulp.watch(path.jsSrc, ['js'])
  gulp.watch(path.fxSrc, ['fx'])
})