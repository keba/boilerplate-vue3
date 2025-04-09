<template>
  <div
    :style="styleDiv"
  >
    <v-text-field
      :id="props.id"
      ref="refTextField"
      v-model="fieldTextField"
      :append-inner-icon="appendPasswordIcon"
      :autocomplete="autocomplete"
      color="primary"
      :hint="props.disabled ? '' : props.hint"
      :label="props.label"
      :name="props.id"
      :persistent-hint="props.hintPersistence"
      :prepend-icon="icons.password"
      :readonly="props.disabled"
      :required="props.required"
      :rules="rulesCombined"
      :style="textFieldStyle"
      :suffix="props.suffix"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="changePasswordVisible"
      @input="calculateMinWidth"
      @keyup.enter.prevent="submitParent"
    >
      <template #append>
        <v-tooltip
          v-if="props.appendIcon && props.appendTooltip"
          :activator="`#${props.id}-append`"
          location="bottom"
          :text="props.appendTooltip"
        />
        <v-btn
          v-if="props.appendIcon"
          :id="`${props.id}-append`"
          class="append-button"
          :icon="true"
          :color="props.appendColour"
          :disabled="props.appendDisabled"
          size="small"
          @click.stop="clickAppend"
        >
          <v-icon :icon="props.appendIcon" />
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script setup>
import {icons} from '@/components/icons.js';
import {computed, onMounted, ref, watch} from 'vue';

const props = defineProps({
  addedRules: {type: Array, default: () => []},
  appendColour: {type: String, default: 'primary'},
  appendDisabled: {type: Boolean, default: false},
  appendIcon: {type: String, default: ''},
  appendTooltip: {type: String, default: ''},
  autocompleteGroup: {type: String, default: ''},
  disabled: {type: Boolean, default: false},
  focus: {type: Boolean, default: false},
  hint: {
    type: String,
    default: 'Passwords must be complex, so no repeating characters, sequential numbers or blacklisted words'
  },
  hintPersistence: {type: Boolean, default: false},
  id: {type: String, required: true},
  label: {type: String, default: 'Password'},
  modelValue: {type: String, default: ''},
  modify: {type: Boolean, default: false},
  required: {type: Boolean, default: true},
  suffix: {type: String, default: ''}
});

const emit = defineEmits([
  'click-append',
  'submit-parent',
  'update:modelValue'
]);

const fieldTextField = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
const fieldWidth = ref(0);
const passwordVisible = ref(false);
const refTextField = ref(null);
const styleDiv = ref({
  boxSizing: 'border-box',
  flex: '1 1 auto',
  minWidth: fieldWidth.value + 'px'
});
const textFieldStyle = ref({
  boxSizing: 'border-box',
  flex: '1 1 auto',
  height: 'auto',
  marginLeft: '5px',
  width: '100%'
});

const calculateMinWidth = () => {
  if (refTextField.value) {
    const newWidth = refTextField.value.$el.querySelector('input').scrollWidth;
    fieldWidth.value = Math.max(newWidth, 300);
  }
};

onMounted(() => {
  if (props.focus) {
    refTextField.value.focus();
  }
  calculateMinWidth();
});

watch([fieldTextField], () => {
  calculateMinWidth();
});

const appendPasswordIcon = computed(() => {
  if (passwordVisible.value) {
    if (props.disabled) {
      return icons.passwordVisibleDisabled;
    }
    return icons.passwordVisible;
  }
  if (props.disabled) {
    return icons.passwordHiddenDisabled;
  }
  return icons.passwordHidden;
});

const autocomplete = computed(() => {
  let token = 'current-password';
  if (props.disabled) {
    return 'off';
  } else if (props.modify) {
    token = 'new-password';
  }
  if (!props.disabled && props.autocompleteGroup) {
    return `section-${props.autocompleteGroup} ${token}`;
  }
  return token;
});

const changePasswordVisible = () => {
  if (!props.disabled) {
    passwordVisible.value = !passwordVisible.value;
  }
};

function clickAppend() {
  emit('click-append', 1);
}

const rules = computed(() => [
  value => {
    if (props.disabled) {
      return true;
    } else {
      if (!props.required && value === '') {
        return true;
      } else if (value === '') {
        return 'Password is required';
      } else if (value.length < 11) {
        return 'Password must be 11 or more characters long';
      }
      return true;
    }
  }
]);

const rulesCombined = computed(() => {
  return [...(rules.value), ...(props.addedRules)];
});

const submitParent = () => {
  emit('submit-parent');
};
</script>

<style
  scoped
  lang="scss"
>
.v-text-field {
  margin-bottom: 5px;
}
</style>
