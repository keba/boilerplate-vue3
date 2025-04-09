import {icons} from '@/components/icons.js';

// for new items, publicPage: true stops redirection regardless of loggedIn status
// use the format as detailed in metaSchema/schemas.js (and used below)
// note: the route 'name' is used in api as a list of errors that could be sent when that page is used against the API

// home is the first route, catchall for a 404 page is the last, other than that everything is ordered by name.

export const routes = [
  {
    component: () => import('@/views/pageHome.vue'),
    name: 'home',
    path: '/',
    meta: {
      couldBeLoggedIn: true,
      icon: icons.home,
      menuUnauthenticated: 1,
      mustBeLoggedIn: false,
      publicPage: true,
      redirectMessage: '',
      title: 'Home'
    }
  },
  {
    component: () => import('@/views/pageAbout.vue'),
    name: 'about',
    path: '/about',
    meta: {
      couldBeLoggedIn: true,
      icon: icons.about,
      menuUnauthenticated: 3,
      mustBeLoggedIn: false,
      publicPage: true,
      redirectMessage: '',
      title: 'About'
    }
  },
  {
    component: () => import('@/views/user/userLogin.vue'),
    name: 'user_login',
    path: '/user/login',
    meta: {
      couldBeLoggedIn: false,
      icon: icons.login,
      menuUnauthenticated: 2,
      mustBeLoggedIn: false,
      publicPage: true,
      redirectMessage: 'You have been redirected to the home page as you are already logged in.',
      title: 'Login'
    }
  },
  {
    component: () => import('@/views/pageNotFound.vue'),
    name: 'not_found',
    path: '/:pathMatch(.*)*',
    meta: {
      couldBeLoggedIn: true,
      icon: icons.notFound,
      menuUnauthenticated: false,
      mustBeLoggedIn: false,
      publicPage: true,
      redirectMessage: '',
      title: 'Page Not Found'
    }
  }
];
