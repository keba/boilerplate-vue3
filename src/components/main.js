import '@/styles/applicationStyles.scss';
import Ajv from 'ajv';
import App from '@/components/App.vue';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {metaSchema} from '@/components/schemas.js';
import {routes} from '@/router/routes.js';
import {useAlertsStore} from '@/stores/alerts.js';
import {useApplicationStore} from '@/stores/application.js';
import {useProgressStore} from '@/stores/progress.js';
import vuetify from '@/plugins/vuetify.js';
import {cloneDeep, keys, values} from 'lodash';
import {createRouter, createWebHistory} from 'vue-router';

async function validateRoutes(routesObject) {
  const ajv = new Ajv();
  const clonedRoutes = cloneDeep(routesObject);
  const errorsFound = [];
  try {
    for (const route of clonedRoutes) {
      const validate = await ajv.compile(metaSchema);
      const validated = await validate(route.meta);
      if (!validated) {
        errorsFound.push(`${route.name} ${route.path} errors: ${JSON.stringify(validate.errors)}`);
      }
      const application = useApplicationStore();
      if (!keys(application.apiErrors).includes(route.name)) {
        errorsFound.push(`route ${route.name} not listed in application.apiErrors store - this needs fixing`);
      }
    }
    return errorsFound;
  } catch (ignored) {
    return [errorsFound];
  }
}

(async () => {
  const app = createApp(App);
  const pinia = createPinia();
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (to.path !== from.path) {
        if (savedPosition) {
          return savedPosition;
        } else {
          return {
            behavior: 'smooth',
            top: 0
          };
        }
      }
    }
  });
  await app.use(pinia);
  await app.use(router);
  await app.use(vuetify);
  // initialise anything that needs initialising
  try {
    const application = useApplicationStore(); // needs to happen after app.use(pinia)
    application.setRouter(router);
    application.setRoutes(routes);
    const errorsFoundDuringMeta = await validateRoutes(application.routes);
    if (errorsFoundDuringMeta.length > 0) {
      // production builds should remove console.log statements, but during development this is helpful.
      console.error('Errors found during meta validation in routes:', errorsFoundDuringMeta); // eslint-disable-line no-console
    }
  } catch (ignored) {
    // send error to external api
  }
  const progress = useProgressStore();
  // things should be initialised by now

  router.beforeEach(async function (to, from) {
    const application = useApplicationStore();
    // noinspection UnusedCatchParameterJS
    try {
      application.setCurrentRoute(to, from.path);
      if (to.meta.publicPage) {
        // the following should check to see if the to.meta.couldBeLoggedIn is true, and if it is, check if the user is logged in and redirect if needed
        // noinspection PointlessBooleanExpressionJS
        if (true) { // eslint-disable-line no-constant-condition
          // noinspection UnnecessaryReturnStatementJS
          return;
        } else {
          // noinspection UnreachableCodeJS
          if (to.meta.redirectMessage.length > 0) {
            const alerts = useAlertsStore();
            alerts.add('warning', to.meta.redirectMessage);
          }
          if (to.name !== 'home') {
            return {name: 'home'};
          }
        }
      } else {
        if (JSON.stringify(application.user) === '{}') {
          progress.showProgressSet(true);
          // log in the user here if they have a session ID or similar saved in a cookie.
        }
        if (to.meta.mustBeLoggedIn) {
          // check if they are logged in, and you can react based on user permissions to view a page or not
          // if they aren't logged in, you should redirect them 'home' and display a warning
        } else if (!to.meta.couldBeLoggedIn) {
          // if they are logged in and try to visit the page, redirect them etc...
        }
      }
    } catch (ignoredError) {
      // log an error somewhere - to an external service perhaps...
    } finally {
      progress.showProgressSet(false);
    }
  });

  router.afterEach(async (to, from, failure) => {
    if (JSON.stringify(from.meta) === '{}') {
      // 'from' is non-existent, so we need to log in and do what would normally be done in router.beforeEach
      // this is where you log in the user if they have a session ID or similar saved in a cookie.
      if (to.meta.publicPage) {
        // the following should check to see if the to.meta.couldBeLoggedIn is true, and if it is, check if the user is logged in and redirect if needed
        // noinspection PointlessBooleanExpressionJS
        if (true) { // eslint-disable-line no-constant-condition
          // noinspection UnnecessaryReturnStatementJS
          return;
        } else {
          // noinspection UnreachableCodeJS
          if (to.meta.redirectMessage.length > 0) {
            const alerts = useAlertsStore();
            alerts.add('warning', to.meta.redirectMessage);
          }
          if (to.name !== 'home') {
            return {name: 'home'};
          }
        }
      } else {
        // code that checks if the user must or could be logged in to view a page and redirects them or gives them an error if they aren't...
      }
    }
    if (failure?.to?.name && failure?.from?.name && failure.to.name === failure.from.name) {
      // afterEach failure 16: from is same as to...
      // Log an error or ignore this behaviour
    } else if (failure === undefined) {
      // ignore if undefined as there was no error
    } else {
      // log an error somewhere - to an external service perhaps...
    }
  });

  router.onError(async (error) => {
    if (JSON.stringify(values(error)) !== '[]') {
      // log an error somewhere - to an external service perhaps...
    }
  });

  // noinspection JSUnusedGlobalSymbols
  app.config.globalProperties.$filters = {
    // add filter functions here if needed so they can be used in pages
  };

  app.mount('#app');
})();
