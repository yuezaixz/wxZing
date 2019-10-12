export default function ({ store, route, redirect }) {
  var url
  if (!store.state.authUser) {
    let { fullPath } = route
    fullPath = encodeURIComponent(fullPath.substr(1))
    url = `/wechat-redirect?visit=${fullPath}`
  } else if (!store.state.authUser.gender) {
    url = '/register'
  } else if (!store.state.authUser.city || !store.state.authUser.hometown) {
    url = '/register/registercity'
  } else if (!store.state.authUser.degree || !store.state.authUser.birthday || !store.state.authUser.height) {
    url = '/register/registeredu'
  } else if (!store.state.authUser.wxcode) {
    url = '/register/registerwx'
  } else if (!store.state.authUser.phoneNumber) {
    url = '/register/registertel'
  } else if (!store.state.authUser.jobType) {
    url = '/register/registerjob'
  } else if (!store.state.authUser.career) {
    url = '/register/registercareer'
  } else if (!store.state.authUser.income) {
    url = '/register/registerincome'
  } else if (!store.state.authUser.photos) {
    url = '/register/registerphoto'
  }

  if (url) {
    return redirect(url)
  }
}
