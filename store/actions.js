import axios from 'axios'
import Services from './services'

async function postUserInfo(state, commit) {
  let { data } = await Services.changeUser({
    ...state.authUser
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
      if (!req.session.user.city) {
        req.session.user.city = '350200'
      }
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

  async selectFilter({state, commit}, {filterGender, onlyCurrActivity}) {
    state.authUser.filterGender = filterGender
    state.authUser.onlyCurrActivity = onlyCurrActivity
    console.log(state.authUser.filterGender, state.authUser.onlyCurrActivity)
    return postUserInfo(state, commit)
  },

  async queryUserByUserId({state}, userId) {
    let { data } = await Services.queryUserById(userId)
    return data
  },

  async zingUserAction({state}, {zingUserId}) {
    let { data } = await Services.zingUserAction(zingUserId)
    return data
  },

  async reportUserAction({state}, {userId}) {
    let { data } = await Services.reportUserAction(userId)
    return data
  },

  async blackUserAction({state}, {userId}) {
    let { data } = await Services.blackUserAction(userId)
    return data
  },

  async queryZingUsers({state}) {
    let { data } = await Services.queryZingUsers()
    return data
  },

  async queryFollowUsers({state}) {
    let { data } = await Services.queryFollowUsers()
    return data
  },

  async fellowUserActivity({state}, {userId}) {
    let { data } = await Services.fellowUserActivity(userId)
    return data
  },

  async randomZing({state}, execludeUserIds) {
    let { data } = await Services.randomZing(state.authUser.filterGender, state.authUser.onlyCurrActivity, execludeUserIds)
    return data
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

  async selectHeight({state, commit}, height) {
    state.authUser.height = height
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

  async cancelApply({state}, {activityId}) {
    const {data} = await Services.cancelApply(activityId)
    if (data.success) {
      return data
    }
    return null
  },

  async fetchPayments({ state }) {
    let { data } = await Services.getPayments()
    console.log(data)
    state.payments = data
    return data
  },

  async queryLast9Users({state}) {
    const {data} = await Services.queryLast9Users()
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
      state.activityFellowUser = data.fellowUser
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
  },

  async queryActivityApply({state}, {activityApplyId}) {
    const {data} = await Services.queryActivityApply(activityApplyId)
    return data
  },

  async queryActivityings() {
    const {data} = await Services.queryActivityings()
    return data
  }
}
