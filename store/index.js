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
      imageCDN: 'pb8e92vqk.bkt.clouddn.com',
      homePageScroll: {
        'home': 0,
        'house': 0
      },
      APICharacters: null,
      IMDb: null,
      user: null,
      payments: [],
      authUser: null,
      qiniuOptions: qiniuOptions,
      registerInfo: {
        gender: 1,
        isLocal: false,
        jobType: 0,
        income: 0,
        houseType: 0,
        degree: 0,
        hometown: '',
        city: '',
        birthdayYear: 0,
        birthdayMonth: 0,
        birthdayDay: 0,
        code: '',
        photos: []
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
