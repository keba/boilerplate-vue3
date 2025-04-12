import {allUnknownRoutes} from '../../api/api.js';
import {
  alertsEmpty,
  checkScreenshot,
  checkTitle,
  storageGet,
  storageUpdate,
  test,
  testButton
} from '../../tester.js';

const defaultPage = '/';
let isDesktop;
let testName;

test.afterEach(async ({context}) => {
  await storageUpdate(testName, context);
});

test.beforeAll(() => {
  const filePath = test.info().file;
  const fileName = filePath.split('/').slice(-1)[0].split('.')[0] || 'unknown file';
  const projectName = test.info().project.name;
  const config = test.info().config.projects.find(project => project.name === projectName);
  isDesktop = (!(config.use.isMobile || false));
  testName = `${projectName} ${isDesktop ? 'desktop' : 'mobile'} ${fileName}`;
});

test.beforeEach(async ({context, page}) => {
  await storageGet(testName, context);
  await allUnknownRoutes(page);
});

test.describe(testName, () => {
  test.describe.configure({ mode: 'serial' });
  test('validate standard buttons', async ({page}) => {
    await page.goto(defaultPage);
    await testButton(page, isDesktop, true, false, 'topBarMenu', '', 'Show Menu');
    await testButton(page, isDesktop, true, false, 'topBarTheme', '', 'Change to Light Theme');
    const about = await testButton(page, isDesktop, true, false, 'topBarAbout', 'About', '');
    await testButton(page, isDesktop, false, false, 'topBarHome', 'Home', '');
    await checkTitle(page, 'Home');
    await alertsEmpty(page);
    await about.hover();
    await checkScreenshot(page, `${testName} ${test.info().title}`, true, undefined);
  });

  test('check theme change and screenshot', async ({page}) => {
    await page.goto(defaultPage);
    const themeButton = await testButton(page, isDesktop, true, false, 'topBarTheme', '', 'Change to Light Theme');
    await themeButton.click();
    await testButton(page, isDesktop, true, false, 'topBarTheme', '', 'Change to Dark Theme');
    await alertsEmpty(page);
    const about = await testButton(page, isDesktop, true, false, 'topBarAbout', 'About', '');
    await about.hover();
    await checkScreenshot(page, `${testName} ${test.info().title}`, true, undefined);
    await themeButton.click();
  });
});
