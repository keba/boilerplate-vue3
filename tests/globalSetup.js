import {DateTime} from 'luxon';
import {directoryCreate} from './tester.js';
import path from 'path';
import {writeFile} from 'fs/promises';

// noinspection JSUnusedGlobalSymbols
export default async function globalSetup() {
  const startTime = DateTime.now().toISO();
  const directoryName = path.resolve('./');
  const testReportsDirectory = path.join(directoryName, 'test-reports');
  await directoryCreate(testReportsDirectory);
  const screenshotsDirectory = path.join(testReportsDirectory, 'screenshots');
  await directoryCreate(screenshotsDirectory);
  await writeFile(path.join(testReportsDirectory, 'test-timing.json'), JSON.stringify({startTime}));
  const start = DateTime.fromISO(startTime).toFormat('yyyy-MM-dd HH:mm:ss');
  console.log(`Testing start: ${start}`); // eslint-disable-line no-console
}
