import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import {expect as baseExpect} from '@playwright/test';
import {DateTime} from 'luxon';
import path from 'path';
import {access, mkdir, stat} from 'fs/promises';

const checkScreenshots = process.env.CHECK_SCREENSHOTS || 'FALSE';
const directoryName = path.resolve('./');
const tests = [];

export const expect = baseExpect.extend({
  toEndWith(received, expected) {
    if (typeof received !== 'string') {
      return {
        message: () => `Expected a string but got a ${typeof received}`,
        pass: false
      };
    }
    const pass = received.endsWith(expected);
    return {
      message: () =>
        pass
          ? `Expected "${received}" not to end with "${expected}"`
          : `Expected "${received}" to end with "${expected}"`,
      pass,
      name: 'toEndWith',
      expected: true,
      actual: pass
    };
  }
});

export {test} from '@playwright/test';

export const tester = {
  domain: 'https://api.test.domain',
  cache: {
    staticUlid: '0123456789ABCDEFGHJKMNPQRS',
    staticDate: DateTime.utc().minus({days: 1}).set({hour: 12, minute: 0, second: 0, millisecond: 0}).toMillis()
  }
};

export async function alertCheck(page, alertText, expectedAlertsCount) {
  const alertList = page.locator('#alertList');
  const alerts = alertList.locator('[id^="alertItem-"]');
  await expect(alerts).toHaveCount(expectedAlertsCount);
  const alert = alerts.last();
  await expect(alert).toHaveText(alertText);
  return alert;
}

export async function alertsEmpty(page) {
  const alertList = page.locator('#alertList');
  await expect(alertList).toHaveCount(0);
}

export async function checkScreenshot(page, testTitle, fullPage, element) {
  if (checkScreenshots === 'TRUE') {
    const screenshotName = `${testTitle.replace(/ /g, '-')}.png`.toLowerCase();
    const screenshotFile = path.join(directoryName, 'test-reports', 'screenshots', screenshotName);
    // a wait is needed as hover sometimes takes a bit to actually have the text show correctly (500 milliseconds for circleci, local works much faster of course, but we can all wait)
    await wait(500);
    if (await fileCheck(screenshotFile)) {
      if (element) {
        await expect.soft(element).toHaveScreenshot(screenshotName);
      } else {
        await expect.soft(page).toHaveScreenshot(screenshotName, {fullPage});
      }
    }
    if (element) {
      await element.screenshot({path: screenshotFile});
    } else {
      await page.screenshot({path: screenshotFile, fullPage});
    }
  }
}

export async function checkTitle(page, title) {
  await expect(page.locator('#topBarTitle')).toHaveText(title);
}

export function deepMerge(originalObject, objectUpdates) {
  const merged = {...originalObject};
  for (const key in objectUpdates) {
    if (Object.prototype.hasOwnProperty.call(objectUpdates, key)) {
      const newValue = objectUpdates[key];
      const originalValue = merged[key];
      if (Array.isArray(newValue) && Array.isArray(originalValue)) {
        merged[key] = newValue;
      } else if (typeof newValue === 'object' && newValue !== null && typeof originalValue === 'object' && originalValue !== null) {
        merged[key] = deepMerge(originalValue, newValue);
      } else {
        merged[key] = newValue;
      }
    }
  }
  return merged;
}

async function directoryCheck(directoryPath) {
  try {
    await access(directoryPath);
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

export async function directoryCreate(directory) {
  try {
    if (!(await directoryCheck(directory))) {
      await mkdir(directory, {recursive: true});
    }
  } catch (error) {
    throw error;
  }
}

export async function fileCheck(fileName) {
  try {
    await access(fileName);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

export function schemaValidate(schema, data) {
  try {
    const ajv = new Ajv();
    ajvFormats(ajv);
    ajv.addFormat('ulid', /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    const result = ajv.validate(schema, data);
    if (ajv.errors && Array.isArray(ajv.errors) && ajv.errors.length > 0) {
      throw new Error(`error when checking against schema: ${JSON.stringify(ajv.errors)}`);
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export async function storageGet(testName, context) {
  if (tests[testName]) {
    await context.clearCookies();
    await context.addCookies(tests[testName].cookies);
  }
}

export async function storageUpdate(testName, context) {
  tests[testName] = await context.storageState();
}

export async function testButton(page, isDesktop, visible, disabled, buttonLocator, buttonText, tooltipText) {
  const button = page.locator(`id=${buttonLocator}`);
  if (visible) {
    await expect(button).toBeVisible();
    await expect(button).toHaveText(buttonText);
    if (disabled) {
      await expect(button).toBeDisabled();
    }
    if (isDesktop && tooltipText.length > 0) {
      const buttonTooltipId = await button.getAttribute('aria-describedby');
      expect(buttonTooltipId).not.toBeNull();
      const buttonTooltip = page.locator(`#${buttonTooltipId}`);
      await button.hover();
      if (disabled) {
        await expect(buttonTooltip).toBeHidden();
      } else {
        await expect(buttonTooltip).toBeVisible();
        await expect(buttonTooltip).toHaveText(tooltipText);
      }
    }
  } else {
    await expect(button).toBeHidden();
  }
  return button;
}

export async function testTextField(page, visible, disabled, focused, id, type, labelText, text, hintText) {
  const textField = page.locator(`id=${id}`);
  if (visible) {
    await expect(textField).toHaveValue(text);
    if (labelText.length > 0) {
      const labelFirst = page.locator(`label[for="${id}"]`).first();
      const labelLast = page.locator(`label[for="${id}"]`).last();
      await expect(labelFirst).toHaveText(labelText);
      await expect(labelLast).toHaveText(labelText);
      if (focused) {
        await expect(labelFirst).toBeVisible();
        await expect(labelLast).toBeHidden();
      } else {
        if (text.length > 0) {
          await expect(labelFirst).toBeVisible();
          await expect(labelLast).toBeHidden();
        } else {
          await expect(labelFirst).toBeHidden();
          await expect(labelLast).toBeVisible();
        }
      }
    }
    const hint = page.locator(`id=${id}-messages`);
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText(hintText);
    await expect(textField).toBeVisible();
    const inputType = await textField.getAttribute('type');
    expect(inputType).toEqual(type);
    if (disabled) {
      await expect(textField).toBeDisabled();
    }
  } else {
    await expect(textField).toBeHidden();
  }
  return textField;
}

export async function testTextAppendInner(page, label, text, icon) {
  const appendInner = page.locator(`i[aria-label="${label} appended action"]`);
  await expect(appendInner).toHaveText(text);
  await expect(appendInner).toHaveRole('button');
  const iconClass = await appendInner.getAttribute('class');
  expect(iconClass).toContain(icon);
  expect(iconClass).toContain('v-icon--clickable');
  return appendInner;
}

export const wait = async (milliseconds) => {
  await new Promise((resolve) => {
    setTimeout(function () {
      return resolve();
    }, milliseconds);
  });
};

export async function waitForUrlChange(page, endsWith, testName) {
  const startUrl = page.url();
  if (!startUrl.endsWith(endsWith)) {
    let count = 0;
    let shouldContinue = true;
    while (shouldContinue && count < 3000) {
      const currentUrl = page.url();
      if (currentUrl.endsWith(endsWith)) {
        shouldContinue = false;
      } else {
        await wait(10);
        count += 10;
      }
    }
    if (count > 500) {
      if (count === 3000) {
        throw new Error(`${testName} waitForUrlChange timed out on startUrl: ${startUrl} looking for endsWith: ${endsWith}`);
      }
      console.log(`\n${testName} waited an extra ${count} milliseconds on startUrl: ${startUrl} looking for endsWith: ${endsWith}`); // eslint-disable-line no-console
    }
  }
  expect(page.url()).toEndWith(endsWith);
}
