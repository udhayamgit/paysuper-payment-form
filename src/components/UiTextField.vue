<template>
<div :class="[container, { [stateDisabled]: disabled }]">
  <TheMask
    v-if="mask"
    v-bind="{ disabled, required, type, ...$attrs }"
    v-model="innerValue"
    :class="inputClasses"
    :mask="mask"
    :tokens="maskTokens"
    autocomplete="off"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', innerValue)"
  />
  <input
    v-else
    v-bind="{ disabled, required, type, ...$attrs }"
    v-model="innerValue"
    :class="inputClasses"
    autocomplete="off"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', innerValue)"
  />
  <label
    :class="labelClass"
    :title="label"
  >
    {{ label }}
  </label>
  <span
    v-if="isVisibleError"
    :class="$style.error"
    :title="errorText"
  >
    {{ errorText }}
  </span>
</div>
</template>

<script>
import { includes } from 'lodash-es';
import { TheMask } from 'vue-the-mask';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    // eslint-disable-next-line
    TheMask,
  },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    mask: {
      default: null,
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
      validator(val) {
        return includes(['text', 'password', 'email'], val);
      },
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      innerValue: this.value,

      maskTokens: {
        '#': { pattern: /\d/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
        '!': { escape: true },
        U: { pattern: /[a-zA-Z\s]/, transform: v => v.toLocaleUpperCase() },
      },
    };
  },
  computed: {
    container() {
      return this.$style.container;
    },
    input() {
      return this.$style.input;
    },
    labelClass() {
      return this.$style.label;
    },
    errorClass() {
      return this.$style.error;
    },
    stateDisabled() {
      return this.$style._disabled;
    },
    stateEmpty() {
      return this.$style._empty;
    },
    stateError() {
      return this.$style._error;
    },
    isEmpty() {
      return !this.value && this.value !== 0;
    },
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      return [
        this.input,
        this.$style[`_${this.type}`] || '',
        this.isEmpty ? this.stateEmpty : '',
        this.isVisibleError ? this.stateError : '',
        this.disabled ? this.stateDisabled : '',
      ];
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}.${this.stateDisabled}`]: {
        opacity: this.$gui.inputDisabledOpacity,
      },
      [`.${this.input}`]: {
        color: this.$gui.inputColor,
        'background-color': this.$gui.inputBoxColor,
        'border-color': this.$gui.inputBorderColor,
      },
      [`.${this.input}:-webkit-autofill, .${this.input}:-internal-autofill-selected`]: {
        '-webkit-box-shadow': `inset 0 0 0 50px ${this.$gui.formBackgroundColor}`,
        '-webkit-text-fill-color': this.$gui.inputColor,
      },
      [`.${this.input}:hover`]: {
        'border-color': this.$gui.inputHoverBorderColor,
      },
      [`.${this.input}:focus`]: {
        'border-color': this.$gui.inputFocusBorderColor,
      },
      [`
        .${this.input}:focus ~ .${this.labelClass},
        .${this.input}:not(:focus):not(.${this.stateEmpty}) ~ .${this.labelClass}
      `]: {
        color: this.$gui.inputFocusLabelColor,
      },
      [`.${this.input}.${this.stateError}`]: {
        'border-color': this.$gui.inputErrorBorderColor,
      },
      [`.${this.labelClass}`]: {
        color: this.$gui.inputLabelColor,
      },
      [`.${this.errorClass}`]: {
        'background-color': this.$gui.inputErrorBoxColor,
        color: this.$gui.inputErrorColor,
      },
    });
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
};
</script>

<style module lang="scss">
$error-box-color: #fc7e57;
$error-font-color: #fff;
$error-font-size: 10px;
$error-font-weight: 600;
$error-height: 17px;

$disabled-opacity: 0.5;

$focus-border-color: #06eaa7;

$input-border-color: rgba(#fff, 0.2);
$input-box-color: transparent;
$input-font-color: #fff;
$input-font-weight: 300;
$input-transition: border-color 0.2s ease-out;

$label-color: rgba(#fff, 0.5);
$label-transition: transform 0.2s ease-out, color 0.2s ease-out;

$main-font-size: 15px;
$main-height: 24px;
$main-additional-height: 18px;

.container {
  display: inline-block;
  padding: $main-additional-height 0;
  position: relative;
  width: 100%;
  font-style: normal;
  font-weight: $input-font-weight;
  text-align: left;
  vertical-align: top;

  &._disabled {
    opacity: $disabled-opacity;
    pointer-events: none;
  }
}

.input {
  background-color: $input-box-color;
  border-width: 0;
  border-bottom-width: 1px;
  border-color: $input-border-color;
  box-sizing: border-box;
  color: $input-font-color;
  display: block;
  font-family: inherit;
  font-weight: $input-font-weight;
  font-size: $main-font-size;
  height: $main-height;
  line-height: $main-height;
  outline: none;
  padding: 0;
  transition: $input-transition;
  width: 100%;

  &:-webkit-autofill,
  &:-internal-autofill-selected {
    -webkit-box-shadow: inset 0 0 0 50px red;
  }

  &:hover {
    border-color: scale-color($input-border-color, $alpha: 37.5%);
  }

  &:focus {
    border-color: $focus-border-color;
  }

  &:focus ~ .label,
  &:not(:focus):not(._empty) ~ .label {
    transform: translateY(-$main-additional-height) scale(0.75, 0.75);
    width: 130%;
  }

  &:focus ~ .label {
    pointer-events: auto;
    color: scale-color($label-color, $alpha: -40%);
  }

  &:not(:focus):not(._empty) ~ .label {
    color: scale-color($label-color, $alpha: -40%);
  }

  &._error {
    border-color: $error-box-color;
  }
}

.label {
  color: $label-color;
  line-height: $main-height;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: $main-font-size;
  pointer-events: none;
  top: $main-additional-height;
  transition: $label-transition;
  width: 100%;

  @include if-ltr {
    transform-origin: left;
    left: 0;
    text-align: left;
  }

  @include if-rtl {
    transform-origin: right;
    right: 0;
    text-align: right;
  }
}

.error {
  background-color: $error-box-color;
  top: $main-height + $main-additional-height + 2px;
  color: $error-font-color;
  display: block;
  font-size: $error-font-size;
  font-weight: $error-font-weight;
  line-height: $error-height;
  position: absolute;
  padding: 0 5px;

  @include if-ltr {
    border-radius: 0 3px 3px 3px;
  }

  @include if-rtl {
    border-radius: 3px 0 3px 3px;
  }
}
</style>
