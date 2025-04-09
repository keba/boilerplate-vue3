<template>
  <v-app-bar
    app
  >
    <template #prepend>
      <v-tooltip
        activator="#topBarMenu"
        location="bottom"
        :text="showMenu ? 'Hide Menu' : 'Show Menu'"
      />
      <v-btn
        id="topBarMenu"
        class="button-border"
        :icon="true"
        @click.stop="menu.setShowMenu()"
      >
        <v-icon>{{ icons.menu }}</v-icon>
      </v-btn>
      <v-divider vertical />
      <v-btn
        id="topBarTheme"
        class="button-border"
        :icon="true"
        @click="toggleTheme"
      >
        <v-icon
          :color="theme.global.name.value === 'dark' ? 'accent' : 'slightlyVisible'"
          :icon="theme.global.name.value === 'dark' ? icons.themeDark : icons.themeLight"
        />
        <v-tooltip
          activator="parent"
          location="bottom"
          :text="theme.global.name.value === 'dark' ? 'Change to Light Theme' : 'Change to Dark Theme'"
        />
      </v-btn>
    </template>
    <template #default>
      <v-divider vertical />
      <v-app-bar-title
        id="topBarTitle"
      >
        {{ application.title }}
      </v-app-bar-title>
      <v-progress-linear
        absolute
        :active="progress.showProgress"
        location="bottom"
        color="accent"
        :indeterminate="progress.showProgress"
        :reverse="progress.showProgressReverse"
      />
    </template>
    <template #append>
      <v-divider
        v-if="route.name !== 'home'"
        vertical
      />
      <v-btn
        v-if="route.name !== 'home'"
        id="topBarHome"
        class="button-border"
        color="primary"
        @click.stop="application.goTo('home')"
      >
        Home
      </v-btn>
      <v-divider
        v-if="route.name !== 'about'"
        vertical
      />
      <v-btn
        v-if="route.name !== 'about'"
        id="topBarAbout"
        class="button-border"
        color="primary"
        @click.stop="application.goTo('about')"
      >
        About
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import {icons} from '@/components/icons.js';
import {useApplicationStore} from '@/stores/application.js';
import {useMenuStore} from '@/stores/menu.js';
import {useProgressStore} from '@/stores/progress.js';
import {useRoute} from 'vue-router';
import {useTheme} from 'vuetify';
import {ref, watch} from 'vue';

const application = useApplicationStore();
const menu = useMenuStore();
const progress = useProgressStore();
const route = useRoute();
const showMenu = ref(menu.showMenu);
const theme = useTheme();

async function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark';
  await application.websiteConfigThemeUpdate(theme.global.name.value);
}

watch(() => [application.websiteConfigThemeMode], ([newValue]) => {
  if (['dark', 'light'].includes(newValue)) {
    if (theme.global.name.value !== newValue) {
      theme.global.name.value = newValue;
    }
  } else {
    theme.global.name.value = 'dark';
  }
});

watch(() => [route.meta.title], ([newValue]) => {
  application.titleUpdate(newValue || '....');
});

watch(() => [menu.showMenu], ([newValue]) => {
  showMenu.value = newValue;
});
</script>

<style
  scoped
  lang="scss"
>
.button-border {
  margin: 0 10px;
  padding: 0 15px;
}

small {
  margin-top: 5px;
  font-size: 0.6rem;
}
</style>
