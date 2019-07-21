export default function ({ store, route, redirect }) {
  if (store.state.authUser.userId !== 4) {
    return redirect('/roleerror')
  }
}
