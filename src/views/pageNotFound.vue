<template>
  <v-card :style="application.style">
    <v-toolbar>
      <v-toolbar-title>Page Not Found</v-toolbar-title>
    </v-toolbar>
    <v-card-text>The page you were trying to find is currently lost. Would you like to go back to where you where, or home?</v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        id="goBack"
        color="warning"
        @click="application.goBack(-2)"
      >
        Go Back
      </v-btn>
      <v-btn
        id="goHome"
        color="warning"
        @click="application.goTo('home')"
      >
        To the Home page
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {useApplicationStore} from '@/stores/application.js';

const application = useApplicationStore();
</script>
