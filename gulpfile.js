const gulp = require("gulp"),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    image = require('gulp-image'),
    pug = require("gulp-pug"),
    sass = require("gulp-sass"),
    babel = require("gulp-babel"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create()

gulp.task('images', function(cb) {
    gulp.src(['./build/**/*.png','./build/**/*.jpg','./build/**/*.gif','./build/**/*.jpeg'])
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            guetzli: false,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task("CompilePug",()=>{
    gulp.src("./build/pug/**/!(_)*.pug")
        .pipe(watch("./build/pug/**/!(_)*.pug"))
        .pipe(plumber())
        .pipe(pug({
            pretty : true
        }))
        .pipe(gulp.dest("./dist/"))
        .pipe(browserSync.stream());
})

//Definicion de Tareas
gulp.task("CompileSass", ()=>{
    gulp.src("./build/sass/**/*.scss")
        .pipe(watch("./build/sass/**/*.scss"))
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest("./dist/css"))
});

gulp.task("minifycss", () => {
    gulp.src(["./dist/css/**/*.css", "!./dist/css/**/*.min.css"])
        .pipe(watch(["./dist/css/**/*.css", "!./dist/css/**/*.min.css"]))
        .pipe(plumber())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("compilejs", () => {
    gulp.src(["./build/js/**/*.js"])
        .pipe(watch(["./build/js/**/*.js"]))
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest("./dist/js"))
});

gulp.task("minifyjs", () => {
gulp.src(["./dist/js/**/*.js","!./dist/js/**/*.min.js"])
    .pipe(watch(["./dist/js/**/*.js","!./dist/js/**/*.min.js"]))
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("serve",()=>{
    browserSync.init({
        server: "./dist/",
        notify: false
    });

    watch("./dist/*.html", ()=>{
        browserSync.reload
    });
});

gulp.task("default", ["CompilePug","CompileSass","compilejs"],() => {
    gulp.start("minifycss");
    gulp.start("minifyjs");
    gulp.start("serve");
});
