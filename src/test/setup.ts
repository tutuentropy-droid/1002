import '@testing-library/jest-dom/vitest'

class LocalStorageMock {
  private store: Record<string, string> = {}
  getItem(key: string) {
    return this.store[key] ?? null
  }
  setItem(key: string, value: string) {
    this.store[key] = value
  }
  removeItem(key: string) {
    delete this.store[key]
  }
  clear() {
    this.store = {}
  }
  get length() {
    return Object.keys(this.store).length
  }
  key(index: number) {
    const keys = Object.keys(this.store)
    return keys[index] ?? null
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

afterEach(() => {
  window.localStorage.clear()
})
