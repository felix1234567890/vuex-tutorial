// Jest setup file for Vue 3 and Pinia testing

// Make Vue available globally for @vue/test-utils
global.Vue = require('vue')
global.VueCompilerDOM = require('@vue/compiler-dom')
global.VueServerRenderer = require('@vue/server-renderer')

// Mock fetch globally if not available
if (!global.fetch) {
  global.fetch = jest.fn()
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}