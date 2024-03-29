<script>
import { mapState, mapActions } from 'vuex';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import LayoutContent from '@/components/LayoutContent.vue';
import LayoutFooter from '@/components/LayoutFooter.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';

export default {
  components: {
    CartSection,
    FormSection,
    LayoutHeader,
    LayoutContent,
    LayoutFooter,
    ActionProcessing,
    OrderCreationError,
  },
  data() {
    return {
      isCartOpened: true,
    };
  },
  computed: {
    ...mapState('PaymentForm', [
      'paymentStatus', 'actionResult', 'orderData', 'isPaymentLoading', 'isFormLoading',
    ]),

    isLoading() {
      return this.paymentStatus === 'INITIAL';
    },
  },
  beforeMount() {
    postMessage('LOADED');
  },
  created() {
    window.addEventListener('beforeunload', () => {
      gtagEvent('formClosed');
    });
  },
  methods: {
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading']),

    async tryToCreateOrder() {
      this.setFormLoading(true);
      await this.createOrder();
      this.setFormLoading(false);
    },
  },
};
</script>

<template>
<div :class="$style.layout">
  <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
    <LayoutHeader
      :isCartOpened="isCartOpened"
      :projectName="orderData ? orderData.project.name : ''"
      :isLoading="isLoading"
      @toggleCart="isCartOpened = !isCartOpened"
    />

    <LayoutContent
      :isCartOpened="isCartOpened"
      :isLoading="isLoading"
    >
      <CartSection
        slot="cart"
        layout="page"
        :isCartOpened="isCartOpened"
      />
      <FormSection
        slot="form"
        layout="page"
      />
    </LayoutContent>

    <LayoutFooter
      :isLoading="isLoading"
    />
  </template>

  <ActionProcessing
    v-if="isPaymentLoading || isFormLoading"
    :class="$style.overlay"
    :content="isFormLoading ? 'no-content' : '3d-security'"
  />
  <OrderCreationError
    v-if="!isFormLoading && paymentStatus === 'FAILED_TO_BEGIN'"
    :class="$style.orderCreationError"
    :message="actionResult.message"
    :type="actionResult.type"
    @tryAgain="tryToCreateOrder"
  />
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    height: 100vh;
  }
}

.preloader {
  position: fixed;
}

.orderCreationError {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1000;
}

.enter,
.leaveTo {
  opacity: 0;
}
.enterTo,
.leave {
  opacity: 1;
}
.enterActive,
.leaveActive {
  transition: opacity 0.15s ease-in-out;
}
</style>
