console.log('component fieldSelect')

class FieldSelect {
  static toggle = (target) => {
    const options = target.nextElementSibling
    options.toggleAttribute('active')

    window.addEventListener(
      'click',
      (e) => {
        if (!options.parentElement.contains(e.target)) {
          options.removeAttribute('active')
          console.log('if event action')
        }
      },
      { once: true, capture: true },
    )

    // setTimeout(() => {
    //   window.addEventListener(
    //     'click',
    //     (e) => {
    //       if (!options.parentElement.contains(e.target))
    //         options.removeAttribute('active')
    //       console.log('if event action !m')
    //     },
    //     { once: true },
    //   )
    // })
  }

  static change = (target) => {
    console.log(target)

    const active =
      target.parentElement.querySelector('*[active]')

    if (active) active.toggleAttribute('active')

    target.toggleAttribute('active')

    const parent = target.parentElement.parentElement

    const label = parent.querySelector('.field__value')

    if (label) {
      label.innerText = target.innerText
      label.classList.remove('field__value--placeholder')
    }

    const list = target.parentElement

    list.toggleAttribute('active')
  }
}

window.fieldSelect = FieldSelect
