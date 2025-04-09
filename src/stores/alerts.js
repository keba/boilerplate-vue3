import {defineStore} from 'pinia';
import {icons} from '@/components/icons.js';
import {ref} from 'vue';
import {useApplicationStore} from '@/stores/application.js';

export const useAlertsStore = defineStore('alerts', () => {
  const array = ref([]);
  let nextId = 1;
  const redirectHome = ref(false);
  const show = ref(false);
  const timerDefault = 7000;
  const timers = {};

  const addNext = () => {
    const returnNextId = nextId;
    nextId += 1;
    return returnNextId;
  };

  const stop = id => {
    if (timers[id]) {
      clearTimeout(timers[id]);
      delete timers[id];
    }
    array.value = array.value.filter(item => item.id !== id);
    if (array.value.length === 0) {
      show.value = false;
    }
  };

  const add = (type, message, timeout = timerDefault) => {
    const data = {
      message: message,
      timeout: timeout,
      type: type
    };
    data.id = addNext();
    if (![
      'error',
      'info',
      'success',
      'warning'
    ].includes(data.type)) {
      data.type = 'warning';
      // send the error to an api for analysis
    }
    data.type = data.type || 'warning';
    switch (data.type) {
      case 'error':
        data.icon = data.icon || icons.alertError;
        break;
      case 'info':
        data.icon = data.icon || icons.alertInfo;
        break;
      case 'success':
        data.icon = data.icon || icons.alertSuccess;
        break;
      case 'warning':
        data.icon = data.icon || icons.alertWarning;
        break;
      default:
        // send the error to an api for analysis
        data.type = 'warning';
        data.icon = data.icon || icons.alertWarning;
    }
    array.value = [...array.value, data];
    show.value = true;
    if (data.timeout !== -1) {
      timers[data.id] = setTimeout(() => {
        if (timers[data.id]) {
          stop(data.id);
        }
      }, data.timeout);
    }
  };

  const currentId = () => {
    return nextId.value;
  };

  const displayError = async error => {
    const errorMessages = [];
    if (error?.data?.message === 'Your session-id is incorrect.') {
      errorMessages.push({
        icon: icons.alertError,
        type: 'error',
        message: 'Your session-id expired, and you were automatically logged out.',
        timeout: 14000
      });
      const application = useApplicationStore();
      await application.logOut();
      redirectHome.value = true;
    } else if (error?.data?.message) {
      if (Array.isArray(error.data.message)) {
        for (const item of error.data.message) {
          if (item.message) {
            errorMessages.push({
              icon: icons.alertWarning,
              message: item.param + ' ' + item.message,
              type: 'warning'
            });
          }
        }
      } else {
        errorMessages.push({
          icon: icons.alertWarning,
          message: error.data.message,
          type: 'warning'
        });
      }
    } else if (error) {
      switch (error.toString()) {
        case 'AxiosError: Network Error':
          errorMessages.push({
            icon: icons.alertError,
            type: 'error',
            message: 'The API server is down at the minute'
          });
          break;
        default:
          errorMessages.push({
            icon: icons.alertError,
            type: 'error',
            message: `an unhandled error occurred: ${error.message}`
          });
        // send the error to an api for analysis
      }
    }
    for (const errorMessage of errorMessages) {
      errorMessage.id = addNext();
      errorMessage.timeout = errorMessage.timeout || timerDefault;
      array.value.push(errorMessage);
      show.value = true;
      if (errorMessage.timeout !== -1) {
        timers[errorMessage.id] = setTimeout(() => {
          if (timers[errorMessage.id]) {
            stop(errorMessage.id);
          }
        }, errorMessage.timeout);
      }
    }
  };

  return {
    array,
    redirectHome,
    show,
    add,
    currentId,
    displayError,
    stop
  };
});
