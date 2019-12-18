export default {
  SET_AUTHUSER: (state, authUser) => {
    console.log('刷新用户信息')
    console.log(authUser)
    state.authUser = authUser
  },
  SET_USER: (state, user) => {
    console.log(user)
    state.user = user
  },
  SET_IMDb: (state, data) => {
    state.IMDb = data
  },
  UPDATA_IMDB: (state, { character, i }) => {
    state.IMDb[i] = character
  },
  REMOVE_IMDBCHARACTER: (state, i) => {
    state.IMDb.splice(i, 1)
  }
}
