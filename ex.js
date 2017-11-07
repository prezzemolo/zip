const zip = require('.')

const { promisify } = require('util')

const wait = ms => new Promise(res => setTimeout(() => res(ms), ms))

const main = async () => {
  console.time('zip')
  const rv = await zip(5, wait, [
    // block 1 (will 8ms)
    5,
    2,
    6,
    8,
    1,
    // block 2 (will 19ms)
    19
  ])
  console.timeEnd('zip')
  return rv
}

main().then(r => { console.log(r); process.exit(0) })
// ~ '27ms'