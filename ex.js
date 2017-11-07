const { default: zip } = require('.')

const { promisify } = require('util')

const waitTimes = [
  // block 1 (will 8ms)
  5,
  2,
  6,
  8,
  1,
  // block 2 (will 19ms)
  19
]
const wait = (i) => new Promise(res => {
  const ms = waitTimes.shift()
  setTimeout(() => res(ms), ms)
})

const main = async () => {
  console.time('zip')
  const rv = await zip(5, wait, waitTimes.length)
  console.timeEnd('zip')
  return rv
}

main().then(r => { console.log(r); process.exit(0) }).catch(console.error)
// ~ '27ms'