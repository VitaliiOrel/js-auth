let a = 5

try {
  if (a < 10) throw new Error('Element is null')
} catch (err) {
  console.log(err.message)
}

console.log('true')
