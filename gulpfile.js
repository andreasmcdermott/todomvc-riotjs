var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify');

function build(watch) {
  var opts = { entries: ['./index.js'] };
  var bundler = watch ? watchify(browserify(opts)) : browserify(opts);
  bundler.transform('sheetify/transform');
  bundler.transform(babelify);

  function bundle() {
    return bundler
      .bundle()
      .on('error', function (e) { console.error(e.message); })
      .pipe(source('main.bundle.js'))
      .pipe(gulp.dest('./dist'));
  }

  bundler.on('update', function () {
    console.log('updating..');
    bundle();
  });
  
  return bundle();
}

gulp.task('build', function () {
  return build(false);
});

gulp.task('watch', function () {
  return build(true);
});

gulp.task('default', ['build']);