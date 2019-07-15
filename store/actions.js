import axios from 'axios'
import Services from './services'

export default {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.openid) {
      commit('SET_AUTHUSER', req.session.user)
    }
  },

  getWechatSignature({
    commit
  }, url) {
    return Services.getWechatSignature(url)
  },

  getWechatOAuth({
    commit
  }, url) {
    return Services.getWechatOAuth(url)
  },

  setAuthUser({ commit }, authUser) {
    commit('SET_AUTHUSER', authUser)
  },

  showToast({state}, args) {
    let {duration, str, toastType} = args || {duration: 0, str: '加载中', toastType: 'loading'}
    duration = duration || 0
    str = str || '加载中'
    toastType = toastType || 'loading'
    state.showToast = true
    state.toastType = `weui-${toastType}`
    state.toastStr = str
    if (duration) {
      setTimeout(() => { state.showToast = false }, duration)
    }
  },

  hiddenToast({state}) {
    state.showToast = false
  },

  async login({ commit }, { email, password }) {
    try {
      let res = await axios.post('/api/login', {
        email,
        password
      })

      let { data } = res
      if (!data.ret) commit('SET_USER', data.user)

      return data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('You can\'t do it')
      }
    }
  },

  async logout({ commit }) {
    await axios.post('/api/logout')
    commit('SET_USER', null)
  },

  async selectGender({state, commit}, gender) {
    state.authUser.gender = gender
    let { data } = await Services.changeUser({
      openid: state.authUser.unionid,
      nickname: state.authUser.nickname,
      phoneNumber: state.authUser.phoneNumber,
      wxcode: state.authUser.wxcode,
      gender: state.authUser.gender,
      degree: state.authUser.degree,
      birthday: state.authUser.birthday,
      xingzuo: state.authUser.xingzuo,
      city: state.authUser.city,
      hometown: state.authUser.hometown,
      career: state.authUser.career,
      income: state.authUser.income,
      jobType: state.authUser.jobType,
      photos: state.authUser.photos,
      houseType: state.authUser.houseType,
      aboutMe: state.authUser.aboutMe,
      aboutOther: state.authUser.aboutOther
    })
    if (data.success) {
      let user = data.data.user
      commit('SET_USER', user)
    }

    return data
  },

  async toggleLocal({state}) {
    state.registerInfo.isLocal = !state.registerInfo.isLocal
  },

  async selectJobType({state}, jobType) {
    state.registerInfo.jobType = jobType
  },

  async selectHouseType({state}, houseType) {
    state.registerInfo.houseType = houseType
  },

  async selectIncome({state}, income) {
    state.registerInfo.income = income
  },

  async fetchPayments({ state }) {
    let { data } = await Services.getPayments()
    console.log(data)
    state.payments = data
    return data
  },

  async fetchFollowers({ state }) {
    // TODO 先用层次5
    console.log('fetchFollowers', state.authUser.userId)
    const res = await Services.followers(state.authUser.userId, 5)

    state.currentFollowers = res.data
    console.log(state.currentFollowers)
    return res
  }
}
