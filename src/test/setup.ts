import '@testing-library/jest-dom'

// @radix-ui/react-slider (and motion layout) require ResizeObserver; jsdom doesn't ship one.
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
