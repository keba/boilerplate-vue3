<template>
  <v-app>
    <TopBar />
    <LeftMenu />
    <v-main>
      <ProgressDialog />
      <AlertPopups />
      <v-container class="flex-container-center">
        <RouterView />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import AlertPopups from '@/components/pageSections/AlertPopups.vue';
import AppFooter from '@/components/pageSections/AppFooter.vue';
import LeftMenu from '@/components/pageSections/LeftMenu.vue';
import ProgressDialog from '@/components/pageSections/ProgressDialog.vue';
import {RouterView} from 'vue-router';
import TopBar from '@/components/pageSections/TopBar.vue';
</script>
