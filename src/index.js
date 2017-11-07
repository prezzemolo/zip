function wrapping (f) {
  return (...rest) => new Promise((resolve, reject) => {
    try {
      const rv = f(...rest)
      return resolve(rv)
    } catch (e) {
      return reject(e)
    }
  })
}

async function runJobWithTimes (start, job, times) {
  const end = start + times
  const promises = []
  for (let i = start; i < end ;i++) {
    promises.push(job(i))
  }
  return Promise.all(promises)
}

exports.default = async (parallelism, job, times) => {
  let runner = job
  if (!(job instanceof Promise)) runner = wrapping(job)
  let tmp = []
  const rvs = []
  for (let i = 0; i < times; i += parallelism) {
    let rp = parallelism
    if (parallelism > (times - i)) rp = times - i
    rvs.push(...(await runJobWithTimes(i, runner, rp)))
  }
  return rvs
}
