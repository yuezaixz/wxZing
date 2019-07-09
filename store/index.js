import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const createStore = () => {
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
      registerInfo: {
        gender: 1,
        isLocal: false,
        jobType: 0,
        income: 0,
        houseType: 0,
        degree: 0,
        birthdayYear: 0,
        birthdayMonth: 0,
        birthdayDay: 0,
        code: '',
        photos: [1, 2, 3, 4, 5]
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
