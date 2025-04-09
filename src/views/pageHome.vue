<template>
  <v-card
    :style="application.style"
  >
    <v-toolbar>
      <v-toolbar-title>website application example</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      This website is an example of what you can do using Vue 3, Vuetify 3, axios and pinia. It uses Playwright for tests, and is wrapped in Vite.
    </v-card-text>
  </v-card>
</template>

<script setup>
import {useApplicationStore} from '@/stores/application.js';

const application = useApplicationStore();
</script>
