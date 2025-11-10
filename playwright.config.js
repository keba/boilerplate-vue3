// @ts-check
import {availableParallelism} from 'node:os';
import {defineConfig} from '@playwright/test';

const isCircleCI = process.env.CIRCLE_CI === 'TRUE';
const numCpus = availableParallelism();
let reporter;
const workers = isCircleCI ? numCpus : (numCpus > 4 ? numCpus - 3 : numCpus);

if (isCircleCI) {
  reporter = [
    ['junit', {outputFile: './test-reports/junit/results.xml'}],
    ['dot']
  ];
} else {
  reporter = [
    ['junit', {outputFile: './test-reports/junit/results.xml'}],
    ['list', {printSteps: false}]
  ];
}

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  expect: {
    timeout: 5000,
    snapshotPathTemplate: './test-reports/screenshots/{arg}{ext}',
    toHaveScreenshot: {
      maxDiffPixels: 10,
      pathTemplate: './test-reports/screenshots/{arg}{ext}'
    }
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
  outputDir: './test-reports/artifacts/',
  projects: [
    {
      name: 'unauthenticated',
      testMatch: 'tests/flows/unauthenticated/*.test.js',
      use: {
        browserName: 'chromium',
        storageState: 'tests/logged-out.json'
      }
    }
  ],
  reporter,
  retries: 0,
  testDir: 'tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry'
  },
  webServer: {
    command: 'npm run preview',
    ignoreHTTPSErrors: false,
    reuseExistingServer: false,
    timeout: 60000,
    url: 'http://localhost:4173'
  },
  workers
});
