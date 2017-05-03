'use strict'
const router = require('koa-router')()
const jsoner = require('./jsoner')
const config = require('../config')
const request = require('request-promise')

const redirectUri = config.host + config.youdao.redirect_uri

// 授权地址
router.get('/youdao/auth', function * () {
  let authUrl = `${config.youdao.baseUrl}/oauth/authorize2?client_id=${config.youdao.client_id}&redirect_uri=${redirectUri}`
  this.redirect(authUrl)
})

// 获取 token 并保存 token
router.get('/youdao/callback', function * () {
  let data = yield request({
    method: 'POST',
    url: `${config.youdao.baseUrl}/oauth/access2`,
    json: true,
    form: {
      client_id: config.youdao.client_id,
      client_secret: config.youdao.client_secret,
      code: this.query.code,
      redirect_uri: redirectUri
    }
  })
  if (data.accessToken) jsoner.writeJSONFile(data)
  this.body = 'Successful, please back to teambition and try again.'
})

module.exports = router
