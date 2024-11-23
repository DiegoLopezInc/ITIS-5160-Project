# Project Grading Checklist

## Testing Setup Instructions
1. Install Testing Dependencies:
```
npm install --save-dev jest supertest mongodb-memory-server
```
2. Verify package.json Test Scripts

3. Running Tests:
```
npm test
Run tests in watch mode (tests re-run when files change)
npm run test:watch
Run tests with coverage report
npm run test:coverage
Run specific test files
npm test tests/integration/auth.test.js
npm test tests/unit/models/user.test.js
Watch mode with specific test file
npm run test:watch -- tests/integration/auth.test.js
```

## Debug tests
npm test -- --detectOpenHandles # Find hanging connections
npm test -- --verbose # Show detailed output

## Testing Tips
1. Always run tests before committing changes
2. Check test coverage regularly
3. Write tests for new features before implementation
4. Keep test descriptions clear and specific
5. Test both success and failure cases
6. Test edge cases and boundary conditions