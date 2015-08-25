var gulp = require('gulp');
var del = require('del');
var mainBowerFiles = require('main-bower-files');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var src = {
  js : 'public/js/app/*.js',
  css : 'public/css/style.css',
  img: 'public/img/*',
  fonts : 'bower/**/fonts/**'
};

var dest = {
  js : 'public/dist/js',
  css : 'public/dist/css',
  img : 'public/dist/img',
  fonts : 'public/dist/fonts'
};

gulp.task('clean', function(cb) {
    del(['public/dist/'], cb);
});

//js
gulp.task('scripts', function() {
    return gulp.src(mainBowerFiles().concat(src.js))
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.concat('lib.min.js'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(dest.js))
        .pipe(plugins.notify({message: 'Scripts task complete'}));
});

//css
gulp.task('css', function() {
    return gulp.src(mainBowerFiles())
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('all.min.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest.css))
        .pipe(plugins.notify({message: 'Css task complete'}));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(src.img)
    // Pass in options to the task
    .pipe(plugins.cache(plugins.imagemin({optimizationLevel: 5, progressive : true, interlaced : true})))
    .pipe(gulp.dest(dest.img))
    .pipe(plugins.notify({message: 'Images task complete'}));
});

// Rerun the task when a file changes
gulp.task('watch', function() {

  // plugins.livereload.listen();

  //   gulp.watch(src.js, ['scripts']);
  //   gulp.watch(src.css, ['css']);
  //   gulp.watch(src.img, ['images']);

  //   gulp.watch(['public/dist/**']).on('change', plugins.livereload.changed);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean' , 'watch'], function() {
  gulp.start('scripts', 'css', 'images');
});