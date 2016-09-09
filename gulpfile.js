var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify')

function build(watch) {
  var bundler = browserify({ entries: ['./index.js'] })
  if (watch) { 
    bundler = watchify(bundler)
  }
  bundler.transform('sheetify/transform')
  bundler.transform(babelify)

  function bundle() {
    return bundler
      .bundle()
      .on('error', function (err) { console.error(err.message); })
      .pipe(source('app.js'))
      .pipe(gulp.dest('./dist/js'))
  }

  bundler.on('update', function () {
    console.log('rebuilding..')
    bundle()
  });
  
  return bundle()
}

gulp.task('build', function () {
  return build(false)
});

gulp.task('watch', function () {
  return build(true)
});

gulp.task('default', ['build'])