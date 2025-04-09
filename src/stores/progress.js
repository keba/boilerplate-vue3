import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useProgressStore = defineStore('progress', () => {
  const inProgress = ref(false);
  const message = ref('Loading Data...');
  const showAfterTimeout = ref(false);
  const showDialog = ref(false);
  const showProgress = ref(false);
  const showProgressReverse = ref(false);
  const timeoutIdProgress = ref(null);
  const timeoutIdDialog = ref(null);

  const clearTimeoutDialog = () => {
    if (timeoutIdDialog.value !== null) {
      if (!inProgress.value) {
        clearTimeout(timeoutIdDialog.value);
      }
      timeoutIdDialog.value = null;
    }
  };

  const clearTimeoutProgress = () => {
    if (timeoutIdProgress.value !== null) {
      if (!inProgress.value) {
        clearTimeout(timeoutIdProgress.value);
      }
      timeoutIdProgress.value = null;
    }
  };

  const clearTimeouts = () => {
    clearTimeoutDialog();
    clearTimeoutProgress();
    inProgress.value = false;
  };

  const hide = () => {
    inProgress.value = false;
    showAfterTimeout.value = false;
    showDialog.value = false;
    showProgress.value = false;
    showProgressReverse.value = false;
    clearTimeouts();
  };

  const show = (newMessage, delayInSeconds = 1, showDialogAfter5seconds = true, showDialogImmediately = false) => {
    showAfterTimeout.value = delayInSeconds > 0;
    inProgress.value = true;
    if (showAfterTimeout.value) {
      clearTimeoutProgress();
      timeoutIdProgress.value = setTimeout(() => {
        if (showAfterTimeout.value) {
          message.value = newMessage;
          showProgress.value = true;
          if (showDialogImmediately) {
            showDialog.value = true;
            inProgress.value = false;
          } else if (showDialogAfter5seconds) {
            clearTimeoutDialog();
            timeoutIdDialog.value = setTimeout(() => {
              if (showAfterTimeout.value) {
                showDialog.value = true;
              }
              inProgress.value = false;
            }, 5000 - (delayInSeconds * 1000) >= 0 ? 5000 - (delayInSeconds * 1000) : 5000);
          }
        }
      }, (delayInSeconds * 1000));
    } else {
      message.value = newMessage;
      showProgress.value = true;
      if (showDialogImmediately) {
        showDialog.value = true;
      } else if (showDialogAfter5seconds) {
        clearTimeoutDialog();
        timeoutIdDialog.value = setTimeout(() => {
          if (showProgress.value) {
            showDialog.value = true;
          }
          inProgress.value = false;
        }, 5000 - (delayInSeconds * 1000) >= 0 ? 5000 - (delayInSeconds * 1000) : 5000);
      }
    }
  };

  const showProgressSet = (update) => {
    if (update) {
      showProgress.value = update;
    } else if (!inProgress.value) {
      showProgress.value = update;
    }
  };

  return {
    message,
    showDialog,
    showProgress,
    showProgressReverse,
    showProgressSet,
    hide,
    show
  };
});
