<script>
import LocaleChanger from '@/components/LocaleChanger.vue';
import VerticalModalHeader from '@/components/VerticalModalHeader.vue';

export default {
  components: {
    LocaleChanger,
    VerticalModalHeader,
  },
  props: {
    opened: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
    };
  },
};
</script>

<template>
<transition
  appear
  :enter-class="$style.enter"
  :enter-active-class="$style.enterActive"
  :enter-to-class="$style.enterTo"
  :leave-class="$style.leave"
  :leave-active-class="$style.leaveActive"
  :leave-to-class="$style.leaveTo"
>
  <div
    v-show="opened"
    :class="$style.layout"
  >
    <VerticalModalHeader
      :hasLocaleChangerOpened="hasLocaleChangerOpened"
      @toggleLocaleChanger="hasLocaleChangerOpened = !hasLocaleChangerOpened"
      @close="$emit('close')"
    />

    <div :class="$style.content">
      <slot />

      <LocaleChanger
        v-if="hasLocaleChangerOpened"
        :class="$style.localeChanger"
        @changeLocale="hasLocaleChangerOpened = false"
      />
    </div>
  </div>
</transition>
</template>

<style module lang="scss">
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  overflow: hidden;
  background-color: #424c66;
  z-index: 10000;
  flex-grow: 1;
}
.content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  max-height: calc(100% - 60px);
  position: relative;
  width: 100%;
  align-items: center;
}
.localeChanger {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(50% - 60px);
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
  transition: opacity 0.3s ease-in-out;
}
</style>
