<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconTotemFail.vue';

export default {
  name: 'PaymentAreaWarning',

  components: {
    IconTotemFail,
  },

  props: {
    content: {
      type: String,
      default: 'card',
      validator(value) {
        return includes(['select-location', 'restricted'], value);
      },
    },

    countries: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      country: '',
    };
  },
};
</script>

<template>
  <div :class="$style.actionResult">
    <div>
      <h2 :class="$style.titleMain">{{$t('PaymentAreaWarning.oops')}}</h2>
      <p :class="$style.titleSub">
        <span v-html="$t('PaymentAreaWarning.cantAcceptPayments')"></span>
        <span
          v-if="content === 'select-location'"
          v-html="$t('PaymentAreaWarning.chooseAnotherArea')"
        ></span>
      </p>
    </div>
    <div :class="$style.icon">
      <IconTotemFail />
    </div>
    <div v-if="content === 'select-location'">
      <UiSelect
        maxHeight="240px"
        :value="country"
        :options="countries"
        :placeholderLabel="$t('PaymentAreaWarning.country')"
        :hasReversible="true"
        @input="$emit('changeCountry', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.actionResult {
  display: flex;
  flex-direction: column;
  padding: 12px 0 20px;
  width: 100%;
}

.titleMain {
  color: #fff;
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  text-align: center;
  margin: 0 0 10px;
}

.titleSub {
  color: #f3da58;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.icon {
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code {
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color: #06eaa7;
}

.email {
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;
  color: #ffffff;
  margin-top: 8px;
}
</style>
