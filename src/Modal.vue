<script>
import { mapState, mapActions } from 'vuex';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';
import VerticalModal from '@/components/VerticalModal.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    ActionProcessing,
    CartSection,
    FormSection,
    Modal,
    ModalCart,
    ModalForm,
    OrderCreationError,
    VerticalModal,
  },

  data() {
    return {
      isVerticalModal: false,
      opened: true,
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'paymentStatus', 'actionResult', 'orderData', 'isPaymentLoading', 'isFormLoading',
    ]),

    isLoading() {
      return this.paymentStatus === 'INITIAL';
    },

    modalComponentName() {
      return this.isVerticalModal ? 'VerticalModal' : 'Modal';
    },
  },

  beforeMount() {
    postMessage('LOADED');

    this.isVerticalModal = window.innerWidth < 580;

    window.addEventListener('resize', () => {
      this.isVerticalModal = window.innerWidth < 580;
    });
  },

  methods: {
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading']),

    closeModal() {
      this.opened = false;
      postMessage('MODAL_CLOSED');
      gtagEvent('formClosed');
    },

    async tryToCreateOrder() {
      this.setFormLoading(true);
      await this.createOrder();
      this.setFormLoading(false);
    },
  },
};
</script>

<template>
<div :class="[$style.layout, { [$style._vertical]: isVerticalModal }]">
  <component
    :is="modalComponentName"
    :opened="opened"
    @close="closeModal"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <ModalCart
        :isLoading="isLoading"
        :projectName="orderData ? orderData.project.name : ''"
      >
        <CartSection />
      </ModalCart>
      <ModalForm
        :isLoading="isLoading"
      >
        <FormSection @close="closeModal" />
      </ModalForm>
    </template>

    <ActionProcessing
      v-if="isPaymentLoading || isFormLoading"
      :content="isFormLoading ? 'no-content' : '3d-security'"
    />
    <OrderCreationError
      v-if="!isFormLoading && paymentStatus === 'FAILED_TO_BEGIN'"
      :message="actionResult.message"
      :type="actionResult.type"
      @tryAgain="tryToCreateOrder"
    />
  </component>
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  min-height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;

  &._vertical {
    flex-direction: column;
  }
}
</style>
