import Vue from 'vue';
import Vuex from 'vuex';

import PaymentForm from './PaymentForm';
import { postMessage } from '../postMessage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastSize: {
      width: 0,
      height: 0,
    },
  },
  mutations: {
    lastSize(state, value) {
      state.lastSize = value;
    },
  },
  actions: {
    reportResize({ state, commit }, newSize) {
      if (
        state.lastSize.width === newSize.width
        && state.lastSize.height === newSize.height
      ) {
        return;
      }
      postMessage('FORM_RESIZE', newSize);
      commit('lastSize', newSize);
    },
  },

  modules: {
    PaymentForm,
  },
});
