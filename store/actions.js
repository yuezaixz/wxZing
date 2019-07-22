import axios from 'axios'
import Services from './services'

async function postUserInfo(state, commit) {
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
    let user = data.user
    commit('SET_USER', user)
  }
  return data
}

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

  async sendSmscode({state}, {tel}) {
    let { data } = await Services.sendSmscode(tel)
    return data
  },

  async checkSmsCode({ state, commit }, {tel, smscode}) {
    let { data } = await Services.checkSmsCode(tel, smscode)
    console.log('data', data)
    if (data.success) {
      state.authUser.phoneNumber = tel
      postUserInfo(state, commit)
    }
    return data
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
    return postUserInfo(state, commit)
  },

  async selectCity({state, commit}, city) {
    state.authUser.city = city
    return postUserInfo(state, commit)
  },

  async selectHometown({state, commit}, hometown) {
    state.authUser.hometown = hometown
    return postUserInfo(state, commit)
  },

  async selectDate({state, commit}, birthday) {
    state.authUser.birthday = birthday
    return postUserInfo(state, commit)
  },

  async selectDegree({state, commit}, degree) {
    state.authUser.degree = degree
    return postUserInfo(state, commit)
  },

  async selectWxcode({state, commit}, wxcode) {
    state.authUser.wxcode = wxcode
    return postUserInfo(state, commit)
  },

  async toggleLocal({state, commit}) {
    state.authUser.isLocal = !state.authUser.isLocal
    return postUserInfo(state, commit)
  },

  async selectJobType({state, commit}, jobType) {
    state.authUser.jobType = jobType
    return postUserInfo(state, commit)
  },

  async selectCareer({state, commit}, career) {
    state.authUser.career = career
    return postUserInfo(state, commit)
  },

  async selectHouseType({state, commit}, houseType) {
    state.authUser.houseType = houseType
    return postUserInfo(state, commit)
  },

  async selectIncome({state, commit}, income) {
    state.authUser.income = income
    return postUserInfo(state, commit)
  },

  async selectPhoto({state, commit}, photos) {
    state.authUser.photos = photos
    return postUserInfo(state, commit)
  },

  async selectAbout({state, commit}, {aboutOther, aboutMe}) {
    state.authUser.aboutMe = aboutMe
    state.authUser.aboutOther = aboutOther
    return postUserInfo(state, commit)
  },

  async selectName({state, commit}, nickname) {
    state.authUser.nickname = nickname
    return postUserInfo(state, commit)
  },

  next({ state }) {
  },

  async applyActivity({state}, {activityId}) {
    const {data} = await Services.applyActivity(activityId)
    if (data.success) {
      return data.data
    }
    return null
  },

  async fetchPayments({ state }) {
    let { data } = await Services.getPayments()
    console.log(data)
    state.payments = data
    return data
  },

  async queryLovers({ state }) {
    const {data} = await Services.queryLovers()
    if (data.success) {
      state.loversCount = data.count
      state.lovers = data.data
    }
    return data
  },

  async queryFollowers({ state }) {
    const {data} = await Services.queryFollowers()
    if (data.success) {
      state.followersCount = data.count
      state.followers = data.data
    }
    return data
  },

  async queryActivityState({ state }) {
    const {data} = await Services.queryActivityState()
    if (data.success) {
      state.activityState = data.state
    }
    return data
  },

  async queryInterest() {
    const {data} = await Services.queryInterest()
    if (data.success) {
      return data.data
    }
    return []
  },

  async queryActivity() {
    const {data} = await Services.queryActivity()
    if (data.success) {
      return data.data
    }
    return []
  }
}
