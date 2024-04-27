console.log('SignupForm')

import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Enter a value',
    IS_BIG: 'The value is too long',
    EMAIL: 'Enter correct value',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }
    if (String(value).length > 20) {
      return this.FIELD_ERROR.IS_BIG
    }
    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(value)) {
        return this.FIELD_ERROR.EMAIL
      }
    }
  }

  submit = async () => {
    if (this.disabled) {
      this.validateAll()
    } else {
      console.log(this.value)
      this.setAlert('progress', 'Loading data...')

      try {
        const res = await fetch('/recovery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
          location.assign('/recovery-confirm')
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
    })
  }
}

window.recoveryForm = new RecoveryForm()
