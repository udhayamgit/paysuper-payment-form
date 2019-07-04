<script>
export default {
  name: 'IconPaysystem',
  props: {
    type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      typesMap: {
        visa: {
          iconComponent: 'IconPaysystemVisa',
        },
        mastercard: {
          iconComponent: 'IconPaysystemMastercard',
        },
        'american-express': {
          iconComponent: '',
        },
        'diners-club': {
          iconComponent: '',
        },
        discover: {
          iconComponent: '',
        },
        jcb: {
          iconComponent: '',
        },
        unionpay: {
          iconComponent: '',
        },
        maestro: {
          iconComponent: '',
        },
        mir: {
          iconComponent: 'IconPaysystemMir',
        },
        elo: {
          iconComponent: '',
        },
        hiper: {
          iconComponent: '',
        },
        hipercard: {
          iconComponent: '',
        },
      },
    };
  },

  computed: {
    component() {
      return this.typesMap[this.type].iconComponent;
    },
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.iconPaysystem}`]: {
        'box-shadow': `0 0 0 1px ${this.$gui.paySystemBackgroundColor}`,
        'background-color': this.$gui.paySystemBackgroundColor,
      },
    });
  },
};
</script>

<template>
<div v-if="component" :class="$style.iconPaysystem">
  <component :is="component" width="20" height="15"></component>
</div>
</template>

<style lang="scss" module>
.iconPaysystem {
  width: 27px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
