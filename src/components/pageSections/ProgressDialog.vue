<template>
  <v-dialog
    v-model="progress.showDialog"
    content-class="progress-dialog"
    transition="dialog-top-transition"
    max-width="700"
    @keydown.esc="clearProgress"
  >
    <v-card>
      <v-card-text>
        <h1>{{ progress.message }}</h1>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {useProgressStore} from '@/stores/progress.js';
import {ref, watch} from 'vue';

const idReverse = ref(0);
const progress = useProgressStore();

const clearProgress = () => {
  clearInterval(idReverse.value);
};

watch(() => [progress.showProgress], ([newValue]) => {
  if (newValue) {
    clearProgress();
    idReverse.value = setInterval(() => {
      progress.showProgressReverse = !progress.showProgressReverse;
    }, 1100);
  } else {
    clearProgress();
  }
});
</script>
