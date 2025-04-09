import {apiPost} from '@/components/functions/api.js';
import {defineStore} from 'pinia';
import {useAlertsStore} from '@/stores/alerts.js';
import {computed, ref, watch} from 'vue';
import {
  websiteConfigMenuShowPermanentGet,
  websiteConfigMenuShowPermanentSet,
  websiteConfigThemeModeGet,
  websiteConfigThemeModeSet
} from '@/components/functions/cookies.js';
const initialWebsiteConfigMenuShowPermanent = websiteConfigMenuShowPermanentGet();
const initialWebsiteConfigThemeMode = websiteConfigThemeModeGet();

// noinspection GrazieInspection,StructuralWrap
export const useApplicationStore = defineStore('application', () => {
  // a list of errors that could return for any pull from the API on that page, [] if no errors expected.
  const apiErrors = {
    about: [],
    home: [],
    not_found: [],
    user_login: [
      'Your username and/or password is incorrect.',
      'You do not have a MFA associated with your account.',
      'You need a MFA Code and have not supplied it.',
      'You specified an invalid MFA Code.',
      'You must change your password before you can continue.'
    ]
  };
  const currentRoute = ref({});
  const domain = import.meta.env.VITE_DOMAIN_WEBSITE_BASE;
  const feedbackSubmitted = ref(false);
  const previousRoutes = ref([]);
  const previousRoute = ref('');
  const previousRouteExists = ref(false);
  const router = ref(null);
  const routes = ref([]);
  const styleMaxWidth = ref(1400);
  const styleMinWidth = ref(300);
  const styleWidth = ref(980);
  const title = ref('.');
  const websiteConfigMenuShowPermanent = ref(initialWebsiteConfigMenuShowPermanent);
  const websiteConfigThemeMode = ref(initialWebsiteConfigThemeMode);

  const style = computed(() => ({
    maxWidth: `${styleMaxWidth.value}px`,
    minWidth: `${styleMinWidth.value}px`,
    width: `${styleWidth.value}px`,
    flex: '1 1 auto'
  }));

  watch([websiteConfigMenuShowPermanent], async () => {
    websiteConfigMenuShowPermanentSet(websiteConfigMenuShowPermanent.value);
  });

  watch([websiteConfigThemeMode], async () => {
    websiteConfigThemeModeSet(websiteConfigThemeMode.value);
  });

  const apiErrorHandler = async (error, alertError) => {
    if (error?.name === 'AxiosError' && ['ERR_NETWORK', 'ECONNABORTED'].includes(error.code)) {
      if (error.code === 'ERR_NETWORK') {
        const alerts = useAlertsStore();
        alerts.add('error', 'The API server is down at the minute.', -1);
        throw {message: 'The API server is down at the minute.'};
      } else if (error.code === 'ECONNABORTED') {
        if (error.message.includes('timeout of ')) {
          if (alertError) {
            const alerts = useAlertsStore();
            alerts.add('error', 'The API server is down at the minute.', -1);
          }
          throw {message: 'The API server took too long to process the request.'};
        }
        if (alertError) {
          const alerts = useAlertsStore();
          alerts.add('error', 'The API server is down at the minute...', -1);
        }
        const alerts = useAlertsStore();
        alerts.add('error', 'An unknown error occurred.');
        throw {message: `an unknown error occurred. ${JSON.stringify(error)}`};
      }
      const alerts = useAlertsStore();
      alerts.add('error', 'An unknown error occurred. Please try again...');
      throw {message: `an unknown error occurred. ${JSON.stringify(error)}`};
    } else if (error.response) {
      const route = router.value.resolve(window.location.pathname);
      if (route?.matched && Array.isArray(route.matched) && route.matched.length === 1) {
        currentRoute.value = route.matched[0];
      }
      if (!(currentRoute.value.name in apiErrors)) {
        // send the error to an api for analysis
        console.log(`application is missing route: ${currentRoute.value.name}`); // eslint-disable-line no-console
      }
      if (!apiErrors[currentRoute.value.name]?.includes(error.response.data?.message) && error.response.status !== 401) {
        const alerts = useAlertsStore();
        alerts.add('warning', error.response.data.message);
        throw error.response;
      } else if (error.response.status === 401) {
        if (alertError) {
          const alerts = useAlertsStore();
          alerts.add('warning', error.response.data.message);
        }
        throw {message: error.response.data.message};
      } else {
        if (alertError) {
          const alerts = useAlertsStore();
          alerts.add('warning', error.response.data.message);
        }
        throw {message: error.response.data.message};
      }
    }
    const alerts = useAlertsStore();
    alerts.add('error', 'A critical error occurred. Please try again later.');
    // send the error to an api for analysis
    throw error;
  };

  const api = {
    post: async function (route, data, useSessionId = true, alertError = true) {
      try {
        const response = await apiPost(route, data, useSessionId);
        return response.data;
      } catch (error) {
        await apiErrorHandler(error, alertError, 'post');
      }
    }
  };

  const goBack = async (pages) => {
    await router.value.go(pages);
  };

  const goTo = async (name, params = false) => {
    if (name.length > 0) {
      if (params) {
        await router.value.push({name, params});
      } else {
        await router.value.push({name});
      }
    }
  };

  const goToPath = async (path) => {
    await router.value.push(path);
  };

  const nowLoggedIn = async data => {
    const alerts = useAlertsStore();
    alerts.add('success', JSON.stringify(data));
    // this function should process data and add it to a user object etc...
  };

  const setCurrentRoute = (newRoute, fromPath) => {
    const priorRoute = previousRoutes.value.at(-1);
    if (priorRoute === newRoute.path) {
      previousRoutes.value.pop();
      const newPreviousRoute = previousRoutes.value.at(-1);
      previousRoute.value = newPreviousRoute || '';
      previousRouteExists.value = !!newPreviousRoute;
    } else {
      previousRoute.value = fromPath;
      previousRouteExists.value = true;
      previousRoutes.value.push(fromPath);
    }
    if (previousRoutes.value.length > 25) {
      previousRoutes.value.shift();
    }
    currentRoute.value = newRoute;
  };

  const setRouter = newRouter => {
    router.value = newRouter;
  };

  const setRoutes = newRoutes => {
    routes.value = newRoutes;
  };

  const titleUpdate = newTitle => {
    title.value = newTitle;
  };

  const websiteConfigThemeUpdate = async newTheme => {
    if (['dark', 'light'].includes(newTheme)) {
      websiteConfigThemeMode.value = websiteConfigThemeModeSet(newTheme);
    } else {
      websiteConfigThemeMode.value = websiteConfigThemeModeSet('dark');
    }
  };

  return {
    api,
    apiErrors,
    currentRoute,
    domain,
    feedbackSubmitted,
    goBack,
    goTo,
    goToPath,
    nowLoggedIn,
    previousRoute,
    previousRouteExists,
    router,
    routes,
    setCurrentRoute,
    setRouter,
    setRoutes,
    style,
    title,
    titleUpdate,
    websiteConfigMenuShowPermanent,
    websiteConfigThemeMode,
    websiteConfigThemeUpdate
  };
});
