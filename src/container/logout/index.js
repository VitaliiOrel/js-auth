import '../../script/test'

console.log('container log out')

import { saveSession } from '../../script/session'

document.addEventListener('DOMContentLoaded', () => {
  saveSession(null)
  location.assign('/')
})
