import axios from 'axios'

const baseUrl = ''

class Services {
  /**
   * 这里发一个异步请求到 /wechat-signature，拿到签名回填初始化
   * 生成合法签名，需要依赖传递过去当前页面的完整 URL
   * Koa 通过 ctx.url 获取未必准确
   * 本地测试，可以修改  config/development 中 appId/appSecret/token
   * @return {
   *   success: 1,
   *   params: {
   *     timestamp,
   *     noncestr,
   *     signature
   *   }
   * }
   */
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${encodeURIComponent(url)}`)
  }

  /**
   * 这里发一个异步请求到 /wechat-oauth，拿到服务器获得的用户资料
   * @return {
   *   success: true,
   *   user: {
   *     nickname,
   *     headurl,
   *     ...
   *   }
   * }
   */
  getWechatOAuth(url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`)
  }

  getPayments() {
    return axios.get('/api/payments')
  }

  sendSmscode(tel) {
    return axios.post(`/api/smscode/${tel}`)
  }

  checkSmsCode(tel, smscode) {
    return axios.post('/api/check_smscode', {
      tel, smscode
    })
  }

  changeUser(user) {
    try {
      return axios.post('/api/change_user', (user || {}))
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('You can\'t do it')
      }
    }
  }

  queryLovers() {
    return axios.get('/api/lovers', {
    })
  }

  queryFollowers() {
    return axios.get('/api/followers', {
    })
  }

  queryInterest() {
    return axios.get('/api/interests', {
    })
  }

  queryActivity() {
    return axios.get('/api/activitys', {
    })
  }

  applyActivity(activityId) {
    return axios.post('/api/activity/apply', {
      activityId
    })
  }

  cancelApply(activityId) {
    return axios.post('/api/activity/apply_cancel', {
      activityId
    })
  }

  queryActivityState() {
    return axios.get('/api/activity_state', {
    })
  }
}

export default new Services()
