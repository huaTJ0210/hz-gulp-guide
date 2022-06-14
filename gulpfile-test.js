const { series, parallel, src, dest } = require('gulp')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const babel = require('gulp-babel')

const fs = require('fs')

function clean(cb) {
  console.log('clean task!!')
  cb()
}

function cssTranspile(cb) {
  console.log('cssTranspile!!')
  cb()
}

function jsTranspile(cb) {
  console.log('cssTranspile!!')
  cb()
}

function build(cb) {
  cb()
}

function streamTask() {
  // 根据文件的地址返回一个读写流，通过pipe写入指定文件中
  return src('user.json').pipe(dest('dist'))
}

// 获取文件中的信息
async function asyncAwaitTask() {
  const res = fs.readFileSync('package.json', { encoding: 'utf-8' })
  console.log(res)
  console.log(JSON.parse(res).version)
  await Promise.resolve(res)
}

/*
   文件的通配符
   + !: 从匹配中排除
*/
function globTask() {
  return src(['src/*/*.js', '!src/vue/*.js']).pipe(dest('dist'))
}

// 插件
function pluginTask() {
  return src('src/*/*.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist'))
}

// parallel:并发执行的任务
exports.build = series(clean, parallel(cssTranspile, jsTranspile))

exports.fileTask = streamTask

exports.asyncTask = asyncAwaitTask

exports.globTask = globTask

exports.pluginTask = pluginTask

// 任务按照顺序执行
exports.default = series(clean, build)
