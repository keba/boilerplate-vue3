<template>
  <div class="alert-popups">
    <v-list
      v-for="alert in alerts.array"
      v-show="alerts.show"
      id="alertList"
      :key="alert.id"
    >
      <v-alert
        :id="`alertItem-${alert.id}`"
        class="alert"
        :icon="alert.icon"
        transition="scale-transition"
        :type="alert.type"
        @click.stop="alerts.stop(alert.id)"
      >
        {{ alert.message }}
      </v-alert>
    </v-list>
  </div>
</template>

<script setup>
import {useAlertsStore} from '@/stores/alerts.js';
import {useApplicationStore} from '@/stores/application.js';
import {watch} from 'vue';

const alerts = useAlertsStore();
const application = useApplicationStore();

watch(() => [alerts.redirectHome], async ([newValue]) => {
  if (newValue) {
    alerts.redirectHome = false;
    if (application.currentRoute.value.name !== 'home') {
      await application.goTo('home');
    }
  }
});
</script>
