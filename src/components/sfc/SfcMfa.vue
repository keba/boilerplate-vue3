<template>
  <div
    :style="styleDiv"
  >
    <v-text-field
      :id="props.id"
      ref="refTextField"
      v-model="fieldTextField"
      autocomplete="one-time-code"
      color="primary"
      :hint="props.disabled ? '' : props.hint"
      :label="props.label"
      :name="props.id"
      :persistent-hint="props.hintPersistence"
      :prepend-icon="icons.mfa"
      :readonly="props.disabled"
      :required="props.required"
      :rules="rulesCombined"
      :style="textFieldStyle"
      :suffix="props.suffix"
      type="text"
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
  disabled: {type: Boolean, default: false},
  focus: {type: Boolean, default: false},
  hint: {type: String, default: 'Required if you have a MFA on your account.'},
  hintPersistence: {type: Boolean, default: false},
  id: {type: String, required: true},
  label: {type: String, default: 'MFA Code'},
  modelValue: {type: String, default: '', required: true},
  modify: {type: Boolean, default: true},
  required: {type: Boolean, default: false},
  suffix: {type: String, default: ''}
});

const emit = defineEmits([
  'click-append',
  'submit-parent',
  'update:modelValue'
]);

const fieldTextField = computed({
  get: () => {
    if (props.disabled) {
      return props.modelValue ? 'Enabled' : 'Not Yet Added';
    }
    return props.modelValue;
  },
  set: (value) => emit('update:modelValue', value)
});
const fieldWidth = ref(0);
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

function clickAppend() {
  if (!props.appendDisabled) {
    emit('click-append');
  }
}

const rules = computed(() => [
  value => {
    if (props.disabled) {
      return true;
    } else {
      if (!props.required && value === '') {
        return true;
      } else if ((/^\d{6}$/u).test(value)) {
        return true;
      } else if ((/[^0-9]/u).test(value)) {
        return 'MFA Codes cannot contain characters that are not integers';
      }
      return 'MFA Codes are 6 digits long and include 0\'s';
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
