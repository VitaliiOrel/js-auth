generateCode = () => {
  const length = 6
  const characters =
    'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * characters.length,
    )
    result += characters[randomIndex]
  }

  return result
}

let res = generateCode()
console.log(res)
