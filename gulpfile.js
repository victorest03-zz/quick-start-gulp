const gulp = require("gulp"),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    //image = require('gulp-image'),
    pug = require("gulp-pug"),
    sass = require("gulp-sass"),
    babel = require("gulp-babel"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create()

// gulp.task('images', function(cb) {
//     gulp.src(['./build/**/*.png','./build/**/*.jpg','./build/**/*.gif','./build/**/*.jpeg'])
//         .pipe(image({
//             pngquant: true,
//             optipng: false,
//             zopflipng: true,
//             jpegRecompress: false,
//             mozjpeg: true,
//             guetzli: false,
//             gifsicle: true,
//             svgo: true,
//             concurrent: 10,
//             quiet: true
//         }))
//         .pipe(gulp.dest('./dist/'));
// });

gulp.task("CompilePug",()=>{
    gulp.src("./build/pug/**/!(_)*.pug")
        .pipe(plumber())
        .pipe(pug({
            pretty : true
        }))
        .pipe(gulp.dest("./dist/"));
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
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream())
});

gulp.task("compilejs", () => {
    gulp.src(["./build/js/**/*.js"])
        .pipe(watch(["./build/js/**/*.js"]))
        .pipe(plumber())
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./dist/js"))
});

gulp.task("serve",()=>{
    browserSync.init({
        server: "./dist/",
        notify: false,
    });

    gulp.watch("./dist/*.html").on("change", browserSync.reload)
    gulp.watch("./dist/js/*.js", () =>{
        browserSync.reload();
    });
});

gulp.task("default", ["CompilePug","CompileSass","compilejs"],() => {
    gulp.watch("./build/pug/**/*.pug",["CompilePug"])
    gulp.start("serve");
});