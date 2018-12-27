<template>
  <div class="payment-form">
    <div class="payment-form-head">
      <div class="payment-form-head__title">{{project.name}}</div>
      <div class="payment-form-head__summ">
        {{activePaymentMethod.amount_with_commissions}}
        {{activePaymentMethod.currency}}
      </div>
      <div class="payment-form-head__delimiter-text">{{ $t('ofThem') }}:</div>
      <div>
        {{ $t('vat') }}:
        {{activePaymentMethod.vat_amount}}
        {{activePaymentMethod.currency}}
      </div>
      <div>
        {{ $t('commission') }}:
        {{activePaymentMethod.user_commission_amount}}
        {{activePaymentMethod.currency}}
      </div>
      <div class="payment-form-info">
        <div class="payment-form-info__item">
          <span class="payment-form-info__key">{{ $t('orderID') }}:</span>
          <span class="payment-form-info__value">{{orderID}}</span>
        </div>
        <div class="payment-form-info__item" v-if="account">
          <span class="payment-form-info__key">{{ $t('account') }}:</span>
          <span class="payment-form-info__value">{{account}}</span>
        </div>
      </div>
    </div>
    <form @submit.prevent="submitPaymentForm">
      <div class="payment-form__methods">
        <PaymentFormMethods
          :paymentMethods="paymentMethods"
          :activePaymentMethodID="activePaymentMethodID"
          @setMethod="setActivePaymentMethod"
        />
      </div>
      <div class="payment-form__forms">
        <PaymentFormBankCard
          v-if="isBankCardPayment"
          v-model="bankCard"
          ref="bankCardForm"
        />
        <BaseTextField
          class="payment-form__ewallet-field"
          v-else
          v-model="ewallet"
          :placeholder="$t('placeholders.ewallet', {name: activePaymentMethod.name})"
          :hasError="$isFieldInvalid('ewallet')"
          :errors="$getFieldErrorMessages('ewallet')"
        />
      </div>
      <div class="payment-form__finish-form">
        <div>
          <BaseTextField
            class="payment-form__email-field"
            v-if="!initialEmail"
            v-model="email"
            :hasError="$isFieldInvalid('email')"
            :errors="$getFieldErrorMessages('email')"
            :placeholder="$t('placeholders.email')"
            name="email"
          />
          <div class="payment-form__payment-failed" v-if="isPaymentErrorVisible">
            <base-error-text>
              {{ $t('paymentFailedMessage') }}
            </base-error-text>
          </div>
        </div>
        <base-button type="submit" :isLoading="isLoading">
          {{ $t('procceedButtonText') }}
        </base-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import PaymentFormMethods from './PaymentFormMethods.vue';
import PaymentFormBankCard from './PaymentFormBankCard.vue';
import { postMessage } from '../postMessage';

export default {
  name: 'PaymentForm',

  components: {
    PaymentFormMethods,
    PaymentFormBankCard,
  },

  data() {
    return {
      bankCard: {
        cardNumber: '',
        month: '',
        year: '',
        cvv: '',
        cardHolder: '',
      },

      ewallet: '',
      email: '',
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderID',
      'account',
      'project',
      'initialEmail',
      'paymentMethods',
      'activePaymentMethodID',
      'isLoading',
      'isPaymentErrorVisible',
    ]),
    ...mapGetters('PaymentForm', ['activePaymentMethod']),

    isBankCardPayment() {
      return this.activePaymentMethod.type === 'bank_card';
    },
  },

  watch: {
    bankCard() {
      this.reportFormResize();
    },
    ewallet() {
      this.reportFormResize();
    },
    email() {
      this.reportFormResize();
    },
    activePaymentMethodID() {
      this.reportFormResize();
    },
    isPaymentErrorVisible() {
      this.reportFormResize();
    },
  },

  validations() {
    if (this.isBankCardPayment) {
      if (this.initialEmail) {
        return {};
      }

      return {
        email: {
          required,
          email,
        },
      };
    }

    return {
      ewallet: {
        required,
      },
    };
  },

  mounted() {
    this.reportFormResize();
  },

  methods: {
    ...mapActions(['reportResize']),
    ...mapActions('PaymentForm', ['setActivePaymentMethod', 'createPayment', 'hidePaymentError']),

    submitPaymentForm() {
      this.reportFormResize();
      this.hidePaymentError();
      this.$v.$touch();

      const isValidArray = [
        !this.$v.$invalid,
      ];

      if (this.isBankCardPayment) {
        const { isValid } = this.$refs.bankCardForm.validate();
        isValidArray.push(isValid);
      }

      if (isValidArray.filter(item => !item).length) {
        // has errors
        return;
      }

      this.createPayment({
        ...this.bankCard,
        ewallet: this.ewallet,
        email: this.initialEmail || this.email,
      });
    },

    reportFormResize() {
      setTimeout(() => {
        const newFormSize = {
          height: this.$el.offsetHeight,
          width: this.$el.offsetWidth,
        };
        this.reportResize(newFormSize);
      }, 0);
    },
  },
};
</script>

<i18n>
{
  "en": {
    "ofThem": "of them",
    "vat": "VAT",
    "commission": "Commission",
    "paymentFailedMessage": "Payment request failed. Please try again later",
    "orderID": "Order #",
    "account": "Account",
    "procceedButtonText": "Procceed",
    "placeholders": {
      "email": "Enter your email",
      "ewallet": "Enter {name} wallet number"
    }
  },
  "ru": {
    "ofThem": "из них",
    "vat": "НДС",
    "commission": "Комиссия",
    "paymentFailedMessage": "Платёж не удался. Пожалуйста, попробуйте ещё раз позже",
    "orderID": "Номер платежа",
    "account": "Учётная запись",
    "procceedButtonText": "Оплатить",
    "placeholders": {
      "email": "Введите ваш email",
      "ewallet": "Введите номер кошелька {name}"
    }
  }
}
</i18n>

<style lang="scss">
@import "@/assets/styles/gui.scss";

.payment-form {
  background: $ui-color-white;
  border: 1px solid $ui-color-grey87;
  box-sizing: border-box;
  color: $ui-color-grey13;
  font-family: $ui-font-family-common;
  font-size: 13px;
  line-height: 16px;

  form {
    margin: 0;
  }

  &__methods {
    padding: 15px 20px;
    border-bottom: 1px solid $ui-color-grey87;
  }

  &__forms {
    min-height: 240px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid $ui-color-grey87;
  }

  &__finish-form {
    padding: 20px;
    background: $ui-color-grey96;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__email-field {
    width: 300px;
  }

  &__ewallet-field {
    max-width: 70%;
  }

  &__payment-failed {
    width: 100%;
    margin-top: 10px;
  }
}

.payment-form-head {
  padding: 15px 20px;
  border-bottom: 1px solid $ui-color-grey87;

  &__title {
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
  }

  &__summ {
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
  }

  &__delimiter-text {
    margin-bottom: 8px;
  }
}

.payment-form-info {
  margin-top: 20px;
  display: table;

  &__item {
    display: table-row;
  }

  &__key {
    color: $ui-color-grey47;
    display: table-cell;
    padding-right: 15px;
  }

  &__value {
    display: table-cell;
  }
}
</style>
