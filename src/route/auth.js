// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const User = require('../class/user')
const Confirm = require('../class/confirm')
const Session = require('../class/session')

User.create({
  email: 'test@mail.com',
  password: 'A1!aaaaa',
  role: 1,
})
User.create({
  email: 'test2@mail.com',
  password: 'A1!aaaaa',
  role: 2,
})
User.create({
  email: 'test3@mail.com',
  password: 'A1!aaaaa',
  role: 3,
})
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        { value: User.USER_ROLE.ADMIN, text: 'Admin' },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Error: Such user already exists',
      })
    }

    const newUser = User.create({ email, password, role })
    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res
      .status(200)
      .json({ message: 'User registered', session })
  } catch (err) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }
})

// ==========================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Such user does not exist',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Code was sent',
    })
  } catch (err) {
    return res.status(400).json({
      massage: err.message,
    })
  }
})

// ==========================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log('recovery-confirm: ', password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Error: Invalid code',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error: User does not exist',
      })
    }

    user.password = password

    console.log('recovery-confirm: ', user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password has been changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ==========================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Signup confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res
      .status(400)
      .json({ message: 'Error. No required data' })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error. You are not logged in.',
      })
    }

    const email = Confirm.getData(code)

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    const user = User.getByEmail(session.user.email)
    session.user.isConfirm = true
    user.isConfirm = true

    return res.status(200).json({
      message: 'Your account has been confirmed.',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }

  console.log(code, token)
})
// ================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Login page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body
  // console.log('.post/login: ', email, password)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: missing required data',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error, no such user.',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error, invalid email or password.',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You logged in',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
