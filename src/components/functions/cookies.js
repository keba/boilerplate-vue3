import vueCookies from 'vue-cookies';

export const cookieNames = {
  menuShowPermanent: 'menuShowPermanent',
  themeMode: 'themeMode'
};
const defaultExpiry = '90d';

vueCookies.config(defaultExpiry);

export function websiteConfigMenuShowPermanentGet() {
  if (!vueCookies.isKey('menuShowPermanent')) {
    vueCookies.set(cookieNames.menuShowPermanent, 'false', defaultExpiry);
  }
  return vueCookies.get(cookieNames.menuShowPermanent) === 'true';
}

export function websiteConfigMenuShowPermanentSet(menuShowPermanent) {
  if (typeof menuShowPermanent === 'boolean') {
    vueCookies.set(cookieNames.menuShowPermanent, menuShowPermanent, defaultExpiry);
    return menuShowPermanent;
  }
  vueCookies.set(cookieNames.menuShowPermanent, false, defaultExpiry);
  return false;
}

export function websiteConfigThemeModeGet() {
  let themeMode;
  if (!vueCookies.isKey('themeMode')) {
    vueCookies.set(cookieNames.themeMode, 'dark', defaultExpiry);
  }
  themeMode = vueCookies.get(cookieNames.themeMode);
  if (!['dark', 'light'].includes(themeMode)) {
    vueCookies.set(cookieNames.themeMode, 'dark', defaultExpiry);
  }
  themeMode = vueCookies.get(cookieNames.themeMode);
  return themeMode;
}

export function websiteConfigThemeModeSet(themeMode) {
  const theme = themeMode === 'light' ? 'light' : 'dark';
  vueCookies.set(cookieNames.themeMode, theme, defaultExpiry);
  return theme;
}
