import '../../script/test'

console.log('container Index page')

document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    const { user } = window.session
    console.log('session: ', user)

    if (user.isConfirm) {
      location.assign('/home')
    } else {
      location.assign('/signup-confirm')
    }
  } else {
    location.assign('/signup')
  }
})
