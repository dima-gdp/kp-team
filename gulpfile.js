const project_folder = require('path').basename(__dirname);
const source_folder = '#src';
const path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
		icons: project_folder + "/icons/"
	},
	src: {
		html: source_folder + "/*.html",
		css: source_folder + "/scss/styles.scss",
		js: [source_folder + "/js/*.js", "!" + source_folder + "/js/_*.js"],
		img: source_folder + "/img/**/*.{jpg,png,webp,svg,gif}",
		fonts: source_folder + "/fonts/*.ttf",
		icons: source_folder + "/icons/*.svg"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,webp,svg,gif}"
	},
	clean: './' + project_folder + "/"
};

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const media = require('gulp-group-css-media-queries');
const rename = require("gulp-rename");
const imageMin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHTML = require('gulp-webp-html');
const webpcss = require("gulp-webpcss");
const svgSprite = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2woff = require('gulp-ttf2woff');

function browserSync() {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
};

function html() {
	return src(path.src.html)
		.pipe(webpHTML())
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css_dev() {
	return src(path.src.css)
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(webpcss())
		.pipe(media())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function css_build() {
	return src(path.src.css)
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(webpcss())
		.pipe(media())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(dest(path.build.css))
}

function libs_scss() {
	return gulp.src([
		'node_modules/swiper/css/swiper.min.css',
		'node_modules/just-validate/dist/css/justValidateTooltip.min.css'
	])
		.pipe(concat('_libs.scss'))
		.pipe(gulp.dest('#src/scss/'))
}

function js_dev() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function js_build() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(src(path.src.js))
		.pipe(fileinclude())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(terser())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(dest(path.build.js))
}

function images_dev() {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(webp({
			quality: 75
		}))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function images_build() {
	return src(path.src.img)
		.pipe(webp({
			quality: 75
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(imageMin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 3,
			svgoPlugins: [{ removeViewBox: true }]
		}))
		.pipe(dest(path.build.img))
}

function svg() {
	return src(path.src.icons)
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					example: true
				}
			}
		}))
		.pipe(dest(path.build.icons))
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

function watchingFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css_dev);
	gulp.watch([path.watch.js], js_dev);
	gulp.watch([path.watch.img], images_dev);
}

function clean() {
	return del(path.clean);
}

const dev = gulp.series(clean, fonts, images_dev, libs_scss, gulp.parallel(html, svg, css_dev, js_dev, watchingFiles, browserSync));
const build = gulp.series(clean, fonts, images_build, libs_scss, gulp.parallel(html, svg, css_build, js_build));


exports.svg = svg;
exports.libs_scss = libs_scss;
exports.fonts = fonts;
exports.images_dev = images_dev;
exports.images_build = images_build;
exports.js_dev = js_dev;
exports.js_build = js_build;
exports.css_dev = css_dev;
exports.css_build = css_build;
exports.html = html;
exports.dev = dev;
exports.build = build;



