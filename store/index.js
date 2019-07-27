import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const createStore = () => {
  var qiniuOptions = {
    host: 'http://upload.qiniu.com',
    tokenUrl: 'http://localhost:8083/uptoken',
    domain: 'http://orqjqg7zj.bkt.clouddn.com/',
    mockToken: true,
    mockTokenValue: 'FMVCRs2-LO1ivRNi4l7mEZE6ZDvPv-519D12kZCO:ZXOlC4-SKwZfalWNIvXUNUZg1wA=:eyJzY29wZSI6InJ0Y3Rlc3QiLCJkZWFkbGluZSI6MjUwMjY5NjAxNH0=',
    hash: true
  }

  return new Vuex.Store({
    state: {
      imageCDN: 'http://wxzing.podoon.cn/',
      homePageScroll: {
        'home': 0,
        'house': 0
      },
      APICharacters: null,
      IMDb: null,
      user: null,
      showToast: false,
      toastStr: '加载中',
      toastType: 'weui-loading',
      payments: [],
      authUser: null,
      followersCount: 0,
      followers: [],
      loversCount: 0,
      lovers: [],
      activityState: 0,
      qiniuOptions: qiniuOptions,
      registerInfo: {
        tel: ''
      }
      // shoppingScroll: 0,
      // houses: [],
      // characters: [],
      // focusHouse: {},
      // focusCharacter: {},
      // products: [],
      // focusProduct: {}
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
