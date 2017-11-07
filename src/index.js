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

function runJobWithArgs (job, args) {
  return Promise.all(args.map(job))
}

module.exports = async (parallelism, job, args) => {
  let runner = job
  if (!(job instanceof Promise)) runner = wrapping(job)
  let tmp = []
  const rvs = []
  const al = args.length
  for (let i = 0; i < al; ++i) {
    tmp.push(args.shift())
    if (tmp.length === parallelism) {
      rvs.push(...(await runJobWithArgs(job, tmp)))
      tmp = []
    }
  }
  if (tmp.length !== 0) {
    rvs.push(...(await runJobWithArgs(job, tmp)))
    tmp = []
  }
  return rvs
}
