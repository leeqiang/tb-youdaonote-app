/**
 * 关联插件示例：Youdao Notes 关联
 * 查询个人 笔记本 列表，加载 笔记 列表，并关联到 Teambition 对象中
 */
'use strict'

const config = require('config')
const Koa = require('koa')
const router = require('koa-router')()
const auth = require('./auth')
const jsoner = require('./jsoner')
const SDK = require('teambition')

const app = new Koa()

// 加载菜单项目
router.get('/youdao/themes', function * () {
  let tokenData = jsoner.readJSONFile()
  if (!tokenData.accessToken) {
    this.status = 401
    this.body = {}
    return
  }
  let sdk = new SDK(tokenData.accessToken, {
    host: config.youdao.baseUrl,
    authHost: config.youdao.baseUrl,
    protocol: 'http'
  })
  let data = yield sdk.post(`${config.youdao.baseUrl}/yws/open/notebook/all.json`).then(function (body) {
    return body.map(function (notebook) {
      return {
        title: notebook.name,
        itemsUrl: config.host + `/themes${notebook.path}/notes`
      }
    })
  })
  this.body = data
})

// 加载每个菜单下的关联项目
router.get('/themes/:notebookPath/notes', function * () {
  let tokenData = jsoner.readJSONFile()
  if (!tokenData.accessToken) {
    this.status = 401
    this.body = {}
    return
  }
  let sdk = new SDK(tokenData.accessToken, {
    host: config.youdao.baseUrl,
    authHost: config.youdao.baseUrl,
    protocol: 'http'
  })
  let url = `${config.youdao.baseUrl}/yws/open/notebook/list.json`
  // 在 url 中添加分页参数，如果不支持分页则忽略
  if (this.request.query.count && this.request.query.page) {
    url += `?page=${this.request.query.page}&count=${this.request.query.count}`
  }
  let data = yield sdk.post(url, { notebook: `/${this.params.notebookPath}` })
  let notes = []
  for (let noteId of data) {
    let note = yield sdk.post('/yws/open/note/get.json', { path: noteId })
    if (note) notes.push({ title: note.title, redirectUrl: note.source })
  }
  this.body = data
})

app.use(require('./youdao').routes())

// 可选：加载权限验证中间件
// 通过 header X-Teambition-Sign 验证 Teambition 用户 id
app.use(auth({
  clientId: config.app.client_id,
  clientSecret: config.app.client_secret
}))

app.use(router.routes())

app.listen(config.port, function () {
  console.log('Server listen on ' + config.port)
})
