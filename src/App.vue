<template>
  <div class="app">
    <div class="app-preloader" v-if="paymentStatus === 'CREATED'">
      <div class="app-preloader__inner">
        <p class="app-preloader__text" v-html="$t('waitingForPaymentResult')"></p>
        <IconLoadingAnimated class="app-preloader__icon" stroke="black" />
      </div>
    </div>

    <div class="app-message _success" v-if="paymentStatus === 'SUCCESSFUL'">
      {{ $t('paymentSuccessful') }}
    </div>
    <template v-else>
      <PaymentForm v-if="orderID" />
      <div class="app-message _failed" v-else ref="appFailed">
        <p v-for="text in $t('paymentInitFailed')" :key="text">{{text}}</p>
      </div>
    </template>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PaymentForm from './components/PaymentForm.vue';
import IconLoadingAnimated from './components/IconLoadingAnimated.vue';
import { postMessage } from './postMessage';

export default {
  name: 'App',
  components: {
    PaymentForm,
    IconLoadingAnimated,
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'paymentStatus',
    ]),
  },

  watch: {
    paymentStatus() {
      this.reportAppResize();
    },
  },

  mounted() {
    if (this.$refs.appFailed) {
      this.reportAppResize();
    }
    postMessage('LOADED');
  },

  methods: {
    ...mapActions(['reportResize']),

    reportAppResize() {
      setTimeout(() => {
        const size = {
          height: this.$el.offsetHeight,
          width: this.$el.offsetWidth,
        };
        postMessage('FORM_RESIZE', size);
      }, 0);
    },
  },
};

</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

p {
  margin: 0;
}
</style>

<style lang="scss">
@import "@/assets/styles/gui.scss";

.app {
  width: 560px;
  position: relative;
}

.app-preloader {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 90px;
    text-align: center;
  }

  &__text {
    margin-bottom: 10px;
    color: $ui-color-grey13;
    font-family: $ui-font-family-common;
    font-size: 14px;
    line-height: 18px;
  }

  &__icon {
  }
}

.app-message {
  background: $ui-color-white;
  border: 1px solid $ui-color-grey87;
  height: 160px;
  padding: 20px;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 14px;
  line-height: 18px;

  &._failed {
    color: $ui-color-red;
    text-align: center;
    padding-top: 50px;
  }

  &._success {
    color: $ui-color-grey13;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    padding-top: 60px;
  }

  p {
    margin-bottom: 5px;
  }
}
</style>

<i18n>
{
  "en": {
    "paymentInitFailed": [
      "Payment form initialization failed.",
      "Try again after refreshing the page or later."
    ],
    "waitingForPaymentResult": "Waiting for the payment result.<br>It may take a few minutes.",
    "paymentSuccessful": "Payment successful."
  },
  "ru": {
    "paymentInitFailed": [
      "Не удалось отображить форму оплаты.",
      "Попробуйте снова, обновив страницу. Либо, попробуйте позже."
    ],
    "waitingForPaymentResult": "Ожидаем результат платежа.<br>Это может занять несколько минут.",
    "paymentSuccessful": "Платёж выполнен успешно."
  }
}
</i18n>
