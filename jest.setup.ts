// Simplified jest setup for development
// Import jest-dom for additional matchers (commented out due to setup issues)
// import '@testing-library/jest-dom';

// Set up global test configuration
if (typeof global !== 'undefined') {
  global.fetch = jest.fn();
}
