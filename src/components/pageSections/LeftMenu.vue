<template>
  <v-navigation-drawer
    id="leftMenu"
    v-model="showMenu"
    location="left"
    :permanent="showMenuPermanent"
    :temporary="!showMenuPermanent"
  >
    <v-list class="list-master">
      <v-virtual-scroll
        :items="menuItems"
        class="list-padding"
      >
        <template #default="{ item }">
          <v-list-item
            :id="`leftMenu-${item.name}`"
            :active="isRouteActive(item.name)"
            class="list-item"
            :to="{name: item.name}"
          >
            <template #prepend>
              <v-icon :icon="item.meta.icon" />
            </template>
            <span>{{ item.meta.title }}</span>
          </v-list-item>
          <v-divider
            class="divider-padding"
            color="slightlyVisible"
          />
        </template>
      </v-virtual-scroll>
      <v-divider class="last-divider" />
      <v-list-item class="last-item">
        <template #append>
          <v-tooltip
            activator="#toggleMenuPermanent"
            location="bottom"
            :text="showMenuPermanent ? 'Change to Sliding' : 'Change to Permanent'"
          />
          <v-btn
            id="toggleMenuPermanent"
            color="slightlyVisible"
            :icon="true"
            size="x-small"
            @click.stop="menu.setShowMenuPermanent()"
          >
            <v-icon
              :icon="showMenuPermanent ? icons.menuChangeToSliding : icons.menuChangeToPermanent"
            />
          </v-btn>
        </template>
        <small class="last-item-text">
          {{ showMenuPermanent ? 'Change Menu to Sliding' : 'Change Menu to Permanent' }}
        </small>
      </v-list-item>
      <v-divider class="space-for-hover-links" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {icons} from '@/components/icons.js';
import {isEqual} from 'lodash';
import {useMenuStore} from '@/stores/menu.js';
import {useRoute} from 'vue-router';
import {ref, watch} from 'vue';

const menu = useMenuStore();
const menuItems = ref(menu.menuItems);
const route = useRoute();
const showMenu = ref(menu.showMenu);
const showMenuPermanent = ref(menu.showMenuPermanent);

watch(() => [menu.menuItems], ([newValue]) => {
  menuItems.value = newValue;
});

watch(() => [menu.showMenu], ([newValue]) => {
  showMenu.value = newValue;
});

watch(() => [menu.showMenuPermanent], ([newValue]) => {
  showMenuPermanent.value = newValue;
});

const isRouteActive = (name, params) => {
  if (params) {
    return route.name === name && isEqual(route.params, params);
  }
  return route.name === name;
};
</script>

<style
  scoped
  lang="scss"
>
.divider-padding {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.last-divider {
  margin-top: auto;
}

.last-item {
  text-align: right;
}

.last-item-text {
  padding-right: 15px;
}

.list-item {
  margin-top: 5px;
  margin-bottom: 5px;
  padding-top: 0;
  padding-bottom: 0;
}

.list-master {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.list-padding {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.space-for-hover-links {
  padding: 0;
  margin-bottom: 14px;
  border: 0;
}
</style>
