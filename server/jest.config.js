/** @type {import('jest').Config} */
export default {
  // Tells Jest we are testing a Node backend, not a browser frontend
  testEnvironment: 'node',
  
  // Disables default Babel transformations so Node's native ESM handles imports
  transform: {},
  
  // Points to the file that spins up our fake MongoDB before tests run
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  
  // Clears mock call counts between every test to prevent data leakage
  clearMocks: true,
  
  // Forces Jest to exit after all tests complete (prevents hanging processes)
  forceExit: true,
  
  // Shows a beautiful, detailed list of each test passing/failing
  verbose: true,
};