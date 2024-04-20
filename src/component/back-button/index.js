console.log('component')

class BackBatton {
  static back() {
    return window.history.back()
  }
}

window.backButton = BackBatton
