const gulp = require("gulp"),
pug = require("gulp-pug"),
sass = require("gulp-sass"),
babel = require("gulp-babel"),
autoprefixer = require("gulp-autoprefixer"),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
browserSync = require('browser-sync').create()

gulp.task("CompilePug",()=>{
    gulp.src("./build/pug/**/!(_)*.pug")
        .pipe(pug({
            pretty : true
        }))
        .pipe(gulp.dest("./dist/"))
        .pipe(browserSync.stream());
})

//Definicion de Tareas
gulp.task("CompileSass", ()=>
//Input
gulp.src("./build/sass/**/*.scss")
    .pipe(sass({
        outputStyle: "expanded"
    }))
    .pipe(autoprefixer({
        versions: ['last 2 browsers']
    }))
    .pipe(gulp.dest("./dist/css"))
//Output
);

gulp.task("minifycss", () => {
gulp.src(["./dist/css/**/*.css", "!./dist/css/**/*.min.css"])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("compilejs", () => {
gulp.src(["./build/js/**/*.js"])
    .pipe(babel())
    .pipe(gulp.dest("./dist/js"))
});

gulp.task("minifyjs", () => {
gulp.src(["./dist/js/**/*.js","!./dist/js/**/*.min.js"])
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

    gulp.watch("./dist/*.html").on('change', browserSync.reload);
});

gulp.task("default",["CompilePug","CompileSass","compilejs","minifycss","minifyjs","serve"],()=>{
    gulp.watch("./build/pug/**/!(_)*.pug",["CompilePug"]);
    gulp.watch("./build/sass/**/*.scss",["CompileSass"]);
    gulp.watch(["./dist/css/**/*.css", "!./dist/css/**/*.min.css"],["minifycss"]);
    gulp.watch(["./build/js/**/*.js"],["compilejs"]);
    gulp.watch(["./dist/js/**/*.js","!./dist/js/**/*.min.js"],["minifyjs"]);
});