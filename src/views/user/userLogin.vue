<template>
  <v-card :style="application.style">
    <v-toolbar>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-form
      ref="refForm"
      v-model="formValid"
      :rules="[rulesForm]"
      @submit.prevent
    >
      <v-card-text>
        <SfcUsername
          id="username"
          v-model="username"
          autocomplete-group="login"
          focus
          hint="Not your email address..."
          required
          @submit-parent="submit"
        />
        <SfcPassword
          id="password"
          v-model="password"
          :append-colour="rememberMe ? 'success' : 'warning'"
          :append-icon="rememberMe ? icons.rememberMeChecked : icons.rememberMeUnchecked"
          :append-tooltip="rememberMe ? 'Disable Remember Me' : 'Enable Remember Me'"
          autocomplete-group="login"
          hint="The password for your account."
          required
          @click-append="rememberMe = !rememberMe"
          @submit-parent="submit"
        />
        <SfcMfa
          id="mfaCode"
          v-model="mfaCode"
          @submit-parent="submit"
        />
      </v-card-text>
      <v-card-actions class="flex-container-right">
        <v-btn
          id="resetForm"
          color="warning"
          @click="resetForm"
        >
          Reset Form
        </v-btn>
        <v-btn
          id="back"
          color="warning"
          :disabled="!application.previousRouteExists"
          :to="application.previousRoute"
        >
          Back...
        </v-btn>
        <v-btn
          id="submit"
          color="success"
          min-width="140"
          :disabled="!rulesForm()"
          @click="submit"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import {icons} from '@/components/icons.js';
import {ref} from 'vue';
import SfcMfa from '@/components/sfc/SfcMfa.vue';
import SfcPassword from '@/components/sfc/SfcPassword.vue';
import SfcUsername from '@/components/sfc/SfcUsername.vue';
import {useAlertsStore} from '@/stores/alerts.js';
import {useApplicationStore} from '@/stores/application.js';
import {useProgressStore} from '@/stores/progress.js';

const application = useApplicationStore();
const alerts = useAlertsStore();
const formValid = ref(false);
const mfaCode = ref('');
const password = ref('');
const progress = useProgressStore();
const refForm = ref(null);
const rememberMe = ref(true);
const username = ref('');

const resetForm = () => {
  username.value = '';
  password.value = '';
  mfaCode.value = '';
};

function rulesForm() {
  if (username.value.length < 3 || username.value.indexOf('@') > -1) {
    return false;
  } else if (password.value.length < 11) {
    return false;
  } else if (!(/^\d{6}$/u).test(mfaCode.value) && mfaCode.value !== '') {
    return false;
  } else if ((/[^0-9]/u).test(mfaCode.value) === true) {
    return false;
  }
  return true;
}

const submit = async () => {
  const validation = await refForm.value.validate();
  if (validation.valid) {
    progress.show('Logging In...', 0);
    const data = {
      password: password.value,
      username: username.value
    };
    if (mfaCode.value.length > 0) {
      data.mfaCode = mfaCode.value;
    }
    try {
      const response = await application.api.post('/user/login', data, false);
      response.rememberMe = rememberMe.value;
      await application.nowLoggedIn(response);
      alerts.add('success', 'You have successfully logged in');
      await application.goTo('home');
    } catch (ignored) {
      // await alerts.displayError(error); // alert is triggered from api
    }
    progress.hide();
  }
};
</script>
