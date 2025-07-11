// localStorage封装
export const localStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
  },
  get(key) {
    const value = window.localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(key) {
    window.localStorage.removeItem(key)
  },
  clear() {
    window.localStorage.clear()
  }
}

// sessionStorage封装
export const sessionStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    window.sessionStorage.setItem(key, value)
  },
  get(key) {
    const value = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  clear() {
    window.sessionStorage.clear()
  }
}
