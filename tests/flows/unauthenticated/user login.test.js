// noinspection ES6PreferShortImport
import {icons} from '../../../src/components/icons.js';
import {
  alertCheck,
  alertsEmpty,
  checkScreenshot,
  checkTitle,
  storageGet,
  storageUpdate,
  test,
  testButton,
  testTextAppendInner,
  testTextField,
  waitForUrlChange
} from '../../tester.js';
import {allUnknownRoutes, postUserLogin} from '../../api/api.js';

const defaultPage = '/user/login';
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
  test('validate standard buttons and fields', async ({page}) => {
    await page.goto(defaultPage);
    // validate always there buttons
    await testButton(page, isDesktop, true, false, 'topBarMenu', '', 'Show Menu');
    await testButton(page, isDesktop, true, false, 'topBarTheme', '', 'Change to Light Theme');
    await testButton(page, isDesktop, true, false, 'topBarAbout', 'About', '');
    await testButton(page, isDesktop, true, false, 'topBarHome', 'Home', '');
    // validate page buttons
    await testButton(page, isDesktop, true, false, 'resetForm', 'Reset Form', '');
    await testButton(page, isDesktop, true, true, 'back', 'Back...', '');
    await testButton(page, isDesktop, true, true, 'submit', 'Login', '');
    await testButton(page, isDesktop, true, false, 'password-append', '', 'Disable Remember Me');
    const username = await testTextField(page, true, false, true, 'username', 'text', 'Username', '', 'Not your email address...');
    const password = await testTextField(page, true, false, false, 'password', 'password', 'Password', '', '');
    await testTextAppendInner(page, 'Password', '', icons.passwordHidden);
    const mfaCode = await testTextField(page, true, false, false, 'mfaCode', 'text', 'MFA Code', '', '');
    await password.click();
    await testTextField(page, true, false, false, 'username', 'text', 'Username', '', 'Username is required');
    await testTextField(page, true, false, true, 'password', 'password', 'Password', '', 'The password for your account.');
    await username.click();
    await testTextField(page, true, false, false, 'password', 'password', 'Password', '', 'Password is required');
    await page.keyboard.type('a');
    await testTextField(page, true, false, true, 'username', 'text', 'Username', 'a', 'Username must be 3 or more characters long');
    await page.keyboard.type('Username');
    await testTextField(page, true, false, true, 'username', 'text', 'Username', 'aUsername', 'Not your email address...');
    await password.click();
    await testTextField(page, true, false, false, 'username', 'text', 'Username', 'aUsername', '');
    await page.keyboard.type('atLeast11');
    await testTextField(page, true, false, true, 'password', 'password', 'Password', 'atLeast11', 'Password must be 11 or more characters long');
    await page.keyboard.type('characters');
    await testTextField(page, true, false, true, 'password', 'password', 'Password', 'atLeast11characters', 'The password for your account.');
    await mfaCode.click();
    await testTextField(page, true, false, false, 'password', 'password', 'Password', 'atLeast11characters', '');
    await testTextField(page, true, false, true, 'mfaCode', 'text', 'MFA Code', '', 'Required if you have a MFA on your account.');
    await page.keyboard.type('a');
    await testTextField(page, true, false, true, 'mfaCode', 'text', 'MFA Code', 'a', 'MFA Codes cannot contain characters that are not integers');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('123');
    await testTextField(page, true, false, true, 'mfaCode', 'text', 'MFA Code', '123', 'MFA Codes are 6 digits long and include 0\'s');
    await page.keyboard.type('456');
    await testTextField(page, true, false, true, 'mfaCode', 'text', 'MFA Code', '123456', 'Required if you have a MFA on your account.');
    await username.click();
    await testTextField(page, true, false, false, 'mfaCode', 'text', 'MFA Code', '123456', '');
    await alertsEmpty(page);
    await checkTitle(page, 'Login');
    await checkScreenshot(page, `${testName} ${test.info().title}`, true, undefined);
  });

  test('from home click menu login and login', async ({page}) => {
    await page.goto('/');
    await checkTitle(page, 'Home');
    const topBarMenu = await testButton(page, isDesktop, true, false, 'topBarMenu', '', 'Show Menu');
    await topBarMenu.click();
    const menuLogin = await testButton(page, isDesktop, true, false, 'leftMenu-user_login', 'Login', '');
    await menuLogin.click();
    await waitForUrlChange(page, defaultPage, testName);
    await checkTitle(page, 'Login');
    await testButton(page, isDesktop, true, false, 'back', 'Back...', '');
    const submit = await testButton(page, isDesktop, true, true, 'submit', 'Login', '');
    await testTextField(page, true, false, true, 'username', 'text', 'Username', '', 'Not your email address...');
    const password = await testTextField(page, true, false, false, 'password', 'password', 'Password', '', '');
    const mfaCode = await testTextField(page, true, false, false, 'mfaCode', 'text', 'MFA Code', '', '');
    await page.keyboard.type('username');
    await password.click();
    await page.keyboard.type('randomPhrase');
    await mfaCode.click();
    await page.keyboard.type('123456');
    await postUserLogin(page, {status: 200, merge: {user: {websiteConfig: {menuOpen: [], menuShowPermanent: false, themeMode: 'dark'}}}});
    await submit.click();
    await waitForUrlChange(page, '/', testName);
    await checkTitle(page, 'Home');
    const alert = await alertCheck(page, 'You have successfully logged in', 2);
    await alert.click();
    // await checkScreenshot(page, `${testName} ${test.info().title}`, true, undefined);
  });
});
