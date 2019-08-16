export default function ({ store, route, redirect }) {
  if (store.state.authUser.role !== 'admin') {
    return redirect('/roleerror')
  }
}
