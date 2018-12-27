/**
 * App entry point
 */

import Vue from 'vue';
import assert from 'assert';
import './plugins/vuelidate';
import App from './App.vue';
import store from './store/RootStore';
import i18n from './i18n';
import { postMessage, receiveMessages } from './postMessage';
import './baseComponents';
import './vueExtentions';

Vue.config.productionTip = false;

const isPageInsideIframe = window.location !== window.parent.location;

/**
 * Cuts out language 2-letters code from navigator.language
 *
 * @return {String}
 */
function getLanguage() {
  if (navigator && navigator.language) {
    return navigator.language.slice(0, 2);
  }
  return 'en';
}

/**
 * Mounts the app into element
 *
 * @param {Object} formData
 * @param {Object} options
 */
async function mountApp(formData, options = {}) {
  if (isPageInsideIframe && process.env.NODE_ENV === 'development') {
    assert(formData, 'The initial data supposed to be recieved through postMessage is not defined');
  } else {
    assert(formData, 'Define "window.P1PAYONE_FORM_DATA" property to set initial data');
  }
  assert(document.querySelector('#p1payone-form'), 'Define "#p1payone-form" element in the document');

  await store.dispatch('PaymentForm/initState', { formData, options });

  const language = getLanguage();
  const VueApp = Vue.extend(App);
  new VueApp({
    store,
    i18n: i18n(options.language || language),
  }).$mount('#p1payone-form');
}

postMessage('INITED');

if (isPageInsideIframe) {
  receiveMessages(window, {
    REQUEST_INIT_FORM(data = {}) {
      const { formData, options } = data;

      /**
       * Outside formData inserting is restricted in production mode
       */
      if (process.env.NODE_ENV === 'development') {
        mountApp(formData, options);
      } else {
        mountApp(window.P1PAYONE_FORM_DATA, options);
      }
    },
  });
} else {
  // Case where the form is opened by as actual page inside browser, not inside iframe
  mountApp(window.P1PAYONE_FORM_DATA);
}
