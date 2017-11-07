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

function runJobWithTimes (job, times) {
  return Promise.all((new Array(times)).fill(null).map(() => job()))
}

exports.default = async (parallelism, job, times) => {
  let runner = job
  if (!(job instanceof Promise)) runner = wrapping(job)
  let tmp = []
  const rvs = []
  for (let i = 0; i < times; i += parallelism) {
    let rp = parallelism
    if (parallelism > (times - i)) rp = times - i
    rvs.push(...(await runJobWithTimes(job, rp)))
  }
  return rvs
}
