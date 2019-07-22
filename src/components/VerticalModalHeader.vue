<script>
import { gtagEvent } from '@/analytics';

export default {
  props: {
    projectName: {
      required: true,
      type: String,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isProfileShown: false,
      isTermsShown: false,
    };
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.link}`]: {
        color: this.$gui.headerTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.cartHoverTextColor,
      },
      [`.${this.$style.tipLink}`]: {
        color: this.$gui.tipHeaderColor,
      },
      [`.${this.$style.tipLink}:hover`]: {
        color: this.$gui.tipLinkHoverColor,
      },
      [`.${this.$style.tipContent}`]: {
        color: this.$gui.tipContentColor,
      },
    });
  },
  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
  },
};
</script>

<template>
<div :class="$style.header">
  <div :class="$style.links">
    <a
      href="#"
      :class="$style.link"
      @click="fireAnalyticsEvent('PaySuper')"
    >Pay Super</a>
    <a
      href="#"
      :class="$style.link"
      @click="fireAnalyticsEvent('IconSupport')"
    >
      <IconSupport :class="$style.iconSupport" />
    </a>
    <span
      :class="[$style.link, $style.locale, { [$style._opened]: hasLocaleChangerOpened }]"
      :title="$i18n.getLocaleLabel()"
      @click="hasLocaleChangerOpened = !hasLocaleChangerOpened"
    >
      {{ $i18n.getLocaleLabel() }}
    </span>
    <span
      :class="$style.link"
      @mouseenter="isTermsShown = true"
      @mouseleave="isTermsShown = false"
    >
      {{ $t('ModalCart.termsOfUse') }}
      <UiTip
        width="240px"
        :visible="isTermsShown"
      >
        <a
          href="#"
          :class="$style.tipLink"
          @click="fireAnalyticsEvent('UserAgreement')"
        >{{ $t('ModalCart.userAgreement') }}</a>
        <a
          href="#"
          :class="$style.tipLink"
          @click="fireAnalyticsEvent('RefundPolicy')"
        >{{ $t('ModalCart.refundPolicy') }}</a>
        <span :class="$style.tipContent">{{ $t('ModalCart.refundAdditionalInfo') }}</span>
      </UiTip>
    </span>
    <span
      :class="$style.link"
      @mouseenter="isProfileShown = true"
      @mouseleave="isProfileShown = false"
    >
      {{ $t('ModalCart.profile') }}
      <UiTip
        innerPosition="right"
        position="bottom"
        width="200px"
        :visible="isProfileShown"
      >
        <a
          href="#"
          :class="$style.tipLink"
          @click="fireAnalyticsEvent('PurchaseInformation')"
        >{{ $t('ModalCart.purchaseInformation') }}</a>
        <a
          href="#"
          :class="$style.tipLink"
          @click="fireAnalyticsEvent('PaymentManagement')"
        >{{ $t('ModalCart.paymentManagement') }}</a>
      </UiTip>
    </span>
  </div>
  <div
    :class="$style.close"
    @click="$emit('close')"
  >
    <IconClose :class="$style.iconClose" />
  </div>
</div>
</template>

<style module lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  z-index: 10;
  width: 100%;
}
.links {
  height: 60px;
  display: flex;
  justify-content: flex-start;
  padding: 0 12px;
}
.link {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 60px;
  cursor: pointer;
  transition: color 0.2s ease-out;
  padding: 0 8px;

  &:hover {
    text-decoration: none;
  }
}
.tipLink {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }
}
.tipContent {
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  margin-top: 12px;
}
.close {
  width: 60px;
  height: 60px;
  padding: 20px;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover > .iconClose {
    fill: #00d697;
    transform: rotate(360deg)
  }
}
.iconClose {
  fill: rgba(#fff, 0.5);
  transition: transform 0.3s ease-out 0.3s;
}
</style>
