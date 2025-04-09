<template>
  <v-card :style="application.style">
    <v-toolbar>
      <v-toolbar-title>About this website</v-toolbar-title>
    </v-toolbar>
    <v-card-text>Some text goes here.</v-card-text>
  </v-card>
</template>

<script setup>
import {useApplicationStore} from '@/stores/application.js';

const application = useApplicationStore();
</script>
