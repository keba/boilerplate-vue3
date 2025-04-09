<template>
  <v-footer
    app
    class="footer-border"
  >
    <v-sheet width="100%">
      <v-row>
        <v-col class="sheet-left">
          <span>{{ websiteName }}</span>
        </v-col>
      </v-row>
    </v-sheet>
  </v-footer>
</template>

<script setup>
import {onMounted, ref} from 'vue';

const websiteName = ref('');

onMounted(() => {
  const {hostname, origin, protocol} = window.location;
  if (protocol === 'https:') {
    websiteName.value = hostname;
  } else {
    websiteName.value = origin;
  }
});
</script>
