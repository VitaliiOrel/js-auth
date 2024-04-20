console.log('SignupForm')

class SignupForm {
  static value = { 1: 1 }

  static validate = (name, value) => {
    return true
  }

  static submit = () => {
    console.log(this.value)
  }

  static change = (name, value) => {
    console.log(name, value)
    if (this.validate(name, value)) this.value[name] = value
  }
}

window.signupForm = SignupForm
