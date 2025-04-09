import {defineStore} from 'pinia';
import {orderBy} from 'lodash';
import {ref} from 'vue';
import {useApplicationStore} from '@/stores/application.js';
import {websiteConfigMenuShowPermanentGet} from '@/components/functions/cookies.js';

const initialWebsiteConfigMenuShowPermanent = websiteConfigMenuShowPermanentGet();

export const useMenuStore = defineStore('menu', () => {
  const unauthenticatedMenu = () => {
    const application = useApplicationStore();
    const updatedMenu = [];
    for (const route of application.routes) {
      if (route.meta.menuUnauthenticated) {
        updatedMenu.push(route);
      }
    }
    return orderBy(updatedMenu, ['meta.menuUnauthenticated'], ['asc']);
  };

  const menuItems = ref(unauthenticatedMenu());
  const showMenu = ref(initialWebsiteConfigMenuShowPermanent);
  const showMenuPermanent = ref(initialWebsiteConfigMenuShowPermanent);

  const setShowMenu = () => {
    showMenu.value = !showMenu.value;
  };

  const setShowMenuPermanent = () => {
    const application = useApplicationStore();
    showMenuPermanent.value = !showMenuPermanent.value;
    if (!showMenuPermanent.value) {
      showMenu.value = false;
    }
    application.websiteConfigMenuShowPermanent = showMenuPermanent.value;
  };

  const update = async () => {
    menuItems.value = [];
    const application = useApplicationStore();
    menuItems.value = unauthenticatedMenu();
    showMenuPermanent.value = application.websiteConfigMenuShowPermanent;
    if (showMenuPermanent.value) {
      showMenu.value = true;
    }
  };

  return {
    menuItems,
    showMenu,
    showMenuPermanent,
    setShowMenu,
    setShowMenuPermanent,
    update
  };
});
