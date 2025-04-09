import validators from './validators.js';
import {deepMerge, schemaValidate, tester} from '../tester.js';

export const allUnknownRoutes = async (page) => {
  await page.route('**', async (route, request) => {
    if (request.url().startsWith('http://localhost:4173')) {
      await route.fallback();
      return;
    }
    console.log(`unknown fulfill: ${request.method()} ${request.url()}`); // eslint-disable-line no-console
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
    throw new Error(`unexpected method: ${request.method()} on ${request.url()}`);
  });
};

async function fulfill(route, options, body) {
  await route.fulfill({
    status: options.status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });
}

export const postUserLogin = async (page, options) => {
  await page.route('**/*', async (route, request) => {
    if (request.url() !== `${tester.domain}/user/login`) {
      await route.fallback();
      return;
    }
    if (request.method() === 'POST') {
      const headers = request.headers();
      if (headers['session-id']?.length > 0) {
        throw new Error(`invalid session-id token ${headers['session-id']}`);
      } else {
        try {
          schemaValidate(validators.postUserLogin, request.postDataJSON());
        } catch (error) {
          throw new Error(`error when checking against schema: ${JSON.stringify(error)}`);
        }
        let body = {
          user: {
            validated: true,
            dateCreated: tester.cache.staticDate,
            dateUpdated: tester.cache.staticDate,
            dateUsernameLastChanged: tester.cache.staticDate,
            dateValidated: tester.cache.staticDate,
            email: 'postuserlogin@test.domain',
            hasMfa: true,
            name: 'Name',
            mfaRequired: false,
            userId: tester.cache.staticUlid,
            username: 'Name',
          },
          sessionId: tester.cache.staticUlid
        };
        if (options.merge) {
          body = deepMerge(body, options.merge);
        }
        switch (options.status) {
          case 200:
            await fulfill(route, options, body);
            break;
          default:
            throw new Error(`invalid status code ${options.status}`);
        }
      }
    } else {
      console.log(`error: ${request.method()} ${request.url()}`); // eslint-disable-line no-console
      throw new Error(`unexpected method: ${request.method()} on ${request.url()}`);
    }
  });
};
