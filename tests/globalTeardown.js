import {DateTime} from 'luxon';
import {fileCheck} from './tester.js';
import path from 'path';
import {readFile, writeFile} from 'fs/promises';

// noinspection JSUnusedGlobalSymbols
export default async function globalTeardown() {
  const directoryName = path.resolve('./');
  const timingFile = path.join(directoryName, 'test-reports', 'test-timing.json');
  const fileExists = await fileCheck(timingFile);
  if (fileExists) {
    const {startTime} = JSON.parse(await readFile(timingFile, 'utf-8'));
    const startedTime = DateTime.fromISO(startTime);
    const endedTime = DateTime.now();
    const difference = endedTime.diff(startedTime, ['minutes', 'seconds']);
    const start = startedTime.toFormat('yyyy-MM-dd HH:mm:ss');
    const ended = endedTime.toFormat('yyyy-MM-dd HH:mm:ss');
    console.log(`Start: ${start}`); // eslint-disable-line no-console
    console.log(`Ended: ${ended}`); // eslint-disable-line no-console
    console.log(`Testing took: ${difference.minutes}m ${Math.floor(difference.seconds)}s`); // eslint-disable-line no-console
    console.log(''); // eslint-disable-line no-console
    // blank line because otherwise the last line isn't printed...
    await writeFile(timingFile, JSON.stringify({start, ended, minutes: difference.minutes, seconds: Math.floor(difference.seconds)}));
  }
}
