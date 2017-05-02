const sessions = {}

export function getSession(sessionid, initialSessionData = {}) {
  return new Promise((resolve, reject) => {
    if (sessions[sessionid] !== undefined) {
      resolve(sessions[sessionid])
    } else {
      const sessionData = initialSessionData
      setSession(sessionid, sessionData)
      resolve(sessionData)
    }
  })
}

export function setSession(sessionid, sessionData) {
  return new Promise((resolve, reject) => {
    sessions[sessionid] = sessionData
    resolve(sessionData)
  })
}
