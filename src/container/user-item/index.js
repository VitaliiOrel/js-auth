import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserItem extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-item')

    try {
      if (!this.element) throw new Error('Element is null')
    } catch (err) {
      console.log('from user-list index.js: ', err.message)
    }

    this.id = new URL(location.href).searchParams.get('id')

    if (!this.id) location.assign('/user-list')

    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING, 'testItem')

    await new Promise((resolve) =>
      setTimeout(resolve, 2000),
    )

    try {
      const res = await fetch(
        `/user-item-data?id=${this.id}`,
        {
          method: 'GET',
        },
      )

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
      user: {
        ...data.user,
        role: USER_ROLE[data.user.role],
        confirm: data.user.isConfirm ? 'yes' : 'no',
      },
    }
  }

  updateView = () => {
    this.element.innerHTML = ''

    console.log('updateView: ', this.status, ':', this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `
          <div class="data">
            <span class="data__title">ID</span>
            <span class="data__value skeleton"></span>
        </div>
          <div class="data">
            <span class="data__title">Email</span>
            <span class="data__value skeleton"></span>
        </div>
          <div class="data">
            <span class="data__title">Role</span>
            <span class="data__value skeleton"></span>
        </div>
          <div class="data">
            <span class="data__title">Verified account</span>
            <span class="data__value skeleton"></span>
        </div>
          `
        break

      case this.STATE.SUCCESS:
        const { id, email, role, confirm } = this.data.user
        this.element.innerHTML = `
        <div class="data">
            <span class="data__title">ID</span>
            <span class="data__value">${id}</span>
        </div>
          <div class="data">
            <span class="data__title">Email</span>
            <span class="data__value">${email}</span>
        </div>
          <div class="data">
            <span class="data__title">Role</span>
            <span class="data__value">${role}</span>
        </div>
          <div class="data">
            <span class="data__title">Verified account</span>
            <span class="data__value">${confirm}</span>
        </div>
        `
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
    console.log(err.message)
  }

  new UserItem()
})
