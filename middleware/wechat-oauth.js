export default function ({ store, route, redirect }) {
  var url
  if (!store.state.authUser) {
    let { fullPath } = route
    fullPath = encodeURIComponent(fullPath.substr(1))
    url = `/wechat-redirect?visit=${fullPath}`
  }

  if (url) {
    return redirect(url)
  }
}
