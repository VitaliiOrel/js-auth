import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserList extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-list')

    try {
      if (!this.element) throw new Error('Element is null')
    } catch (err) {
      console.log('from user-list index.js: ', err.message)
    }
    console.log('START. Step 0.')
    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING, 'testData')
    await new Promise((resolve) =>
      setTimeout(resolve, 3000),
    )
    try {
      const res = await fetch('/user-list-data', {
        method: 'GET',
      })

      const data = await res.json()

      console.log('data from UserList loadData: ', data)

      if (res.ok) {
        this.updateStatus(
          this.STATE.SUCCESS,
          this.convertData(data),
        )
      } else {
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (err) {
      console.log(err)
      this.updateStatus(this.STATE.ERROR, {
        message: err.message,
      })
    }
  }

  convertData = (data) => {
    return {
      ...data,
      list: data.list.map((item) => ({
        ...item,
        role: USER_ROLE[item.role],
      })),
    }
  }

  updateView = () => {
    this.element.innerHTML = ''

    console.log('updateView: ', this.status, ':', this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML += `
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
        </div>
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
        </div>
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
        </div>
          `
        break

      case this.STATE.SUCCESS:
        this.data.list.forEach((item) => {
          this.element.innerHTML += `
          <a href="/user-item?id=${item.id}" class="user user--click">
            <span class="user__title">${item.email}</span>
            <span class="user__sub">${item.role}</span>
        </a>
          `
        })
        break

      case this.STATE.ERROR:
        this.element.innerHTML = `<span class="alert alert--error">${this.data.message}</span>`
        break
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!window.session || !window.session.user.isConfirm) {
      console.log('from user-list.js: ', window.session)
      location.assign('/')
    }
  } catch (err) {
    console.log('from user-list.js: ', err.message)
  }

  new UserList()
})
