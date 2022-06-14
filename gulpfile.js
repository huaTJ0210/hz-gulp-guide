const { src, dest, watch, series, parallel } = require('gulp')
const del = require('del') // 清除指定目录
const htmlmin = require('gulp-htmlmin')
const connect = require('gulp-connect')
const dartSass = require('dart-sass')
const sass = require('gulp-sass')(dartSass)
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const eslint = require('gulp-eslint')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const DISTDIR = 'dist/static'
// 清除dist目录
async function delDistDir() {
  await del([DISTDIR])
}
// html的压缩
function htmlMin() {
  return src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(DISTDIR))
}

//开发环境下html的压缩
async function devHtmlMin() {
  await htmlMin().pipe(connect.reload())
}
// 生产环境html的压缩
function prodHtmlMin() {
  return htmlMin()
}

//转化sass、合并和压缩css
function cssMin() {
  return src(['css/*.css', 'css/*.scss'])
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(dest(`${DISTDIR}/css`))
}

//css的开发环境
async function devCSSMin() {
  await cssMin().pipe(connect.reload())
}
// css的生产环境
function prodCSSMin() {
  return cssMin()
}

// 处理js文件
function minJS() {
  return src('js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(`${DISTDIR}/js`))
}

// 开发环境下处理js'文件
async function devMinJS() {
  await minJS().pipe(connect.reload())
}

function prodMinJS() {
  return minJS()
}

function server() {
  connect.server({
    root: DISTDIR,
    port: 8080,
    livereload: true
  })
}

function watchFile() {
  watch(['css/*.css', 'css/*.scss'], { ignoreInitial: false }, devCSSMin)
  watch('js/*.js', { ignoreInitial: false }, devMinJS)
  watch('index.html', { ignoreInitial: false }, devHtmlMin)
}

// 开发环境
exports.dev = series(watchFile, server)

// 生产环境
exports.build = series(delDistDir, parallel(prodHtmlMin, prodCSSMin, prodMinJS))
