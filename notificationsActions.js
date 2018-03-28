import nanoid                         from 'nanoid';
import { List }                       from 'immutable';

// region Добавление уведомления в стек
const TIMEOUT = 10000;
const NOTIFICATION_ADD            = 'NOTIFICATION_ADD';
const NOTIFICATION_REMOVE         = 'NOTIFICATION_REMOVE';
const NOTIFICATION_REMOVE_TIMEOUT = 'NOTIFICATION_REMOVE_TIMEOUT';
const NOTIFICATION_FLAG_TO_REMOVE = 'NOTIFICATION_FLAG_TO_REMOVE';
const NOTIFICATION_ADD_TIMEOUT    = 'NOTIFICATION_ADD_TIMEOUT';

function addNotification(result, alertType) {
  return (dispatch) => {
    const id = nanoid();
    const timeout = setTimeout(() => {
      dispatch(flagToRemoveNotification(id));
    }, TIMEOUT);
    const params = {
      message: result.message,
      alertType,
      id,
      timeout
    };

    if (shouldAddNotification(params.message)) {
      return dispatch(addNotificationDo(params));
    }
  };
}

function shouldAddNotification(message) {
  return !!message;
}

function addNotificationDo(params) {
  return {
    type: NOTIFICATION_ADD,
    ...params
  };
}

function flagToRemoveNotification(id = undefined) {
  return {
    type: NOTIFICATION_FLAG_TO_REMOVE,
    id
  };
}

function removeNotification(id = undefined) {
  return {
    type: NOTIFICATION_REMOVE,
    id
  };
}

function manageTimeoutNotification(hold) {
  return (dispatch, getState) => {
    if (hold) {
      return dispatch(manageTimeoutNotificationClear());
    }

    const list = getState().notifications.list.get('items', List());
    const timers = [];

    list.forEach((item) => {
      const timeout = setTimeout(() => {
        dispatch(flagToRemoveNotification(item.get('id')));
      }, TIMEOUT);

      timers.push(timeout);
    });

    return dispatch(manageTimeoutNotificationAdd(timers));
  };
}

function manageTimeoutNotificationClear() {
  return {
    type: NOTIFICATION_REMOVE_TIMEOUT
  };
}

function manageTimeoutNotificationAdd(timers) {
  return {
    type: NOTIFICATION_ADD_TIMEOUT,
    timers
  };
}
// endregion

export {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
  NOTIFICATION_REMOVE_TIMEOUT,
  NOTIFICATION_ADD_TIMEOUT,
  NOTIFICATION_FLAG_TO_REMOVE,
  addNotification,
  removeNotification,
  manageTimeoutNotification
};
