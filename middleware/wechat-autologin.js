import axios from 'axios'

export default function ({ commit, store, route, redirect }) {
  if (!store.state.authUser) {
    let { fullPath } = route
    fullPath = encodeURIComponent(fullPath.substr(1))
    return redirect(`/wechat-redirect?visit=${fullPath}`)
  } else {
    if (store.state.authUser && store.state.authUser.unionid) {
      axios.get('http://wxzing.officeplan.cn/api/user/auto_login/' + store.state.authUser.unionid).then((loginRes) => {
        if (loginRes.data.success) {
          let user = loginRes.data.data
          store.state.authUser = user
        } else {
          let { fullPath } = route
          fullPath = encodeURIComponent(fullPath.substr(1))
          return redirect(`/wechat-redirect?visit=${fullPath}`)
        }
      })
    }
  }
}
