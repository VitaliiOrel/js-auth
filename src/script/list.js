export class List {
  STATE = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  }

  status = null
  data = null
  element = null

  updateStatus = (status, data) => {
    console.log(
      'updateStatus from class List  ',
      'status: ',
      status,
      'data: ',
      data,
    )
    this.status = status

    if (data) {
      this.data = data
    }

    this.updateView()
  }

  // updateView = () => {}

  // loadData = async () => {}

  // convertData = () => {}
}
