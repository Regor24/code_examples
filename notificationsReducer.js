import {
  fromJS,
  Map,
  List
}                                     from 'immutable';
import { notificationsActions }       from '../actions';

const {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
  NOTIFICATION_REMOVE_TIMEOUT,
  NOTIFICATION_ADD_TIMEOUT,
  NOTIFICATION_FLAG_TO_REMOVE
} = notificationsActions;

const initialState = Map({
  items: List()
});

export default function (state = initialState, action) {

  switch (action.type) {

    case NOTIFICATION_ADD:
      return state
        .update('items', items => {
          const newItem = Map({
            text: action.message,
            type: action.alertType,
            id: action.id,
            timeout: action.timeout,
            shouldUnmount: false
          });
          const total = items.count();
          const maxItems = 2;

          if (total > maxItems) {
            const latestIds = [];

            for (let i = 0; i < total - maxItems; i++) {
              latestIds.push(items.get(i).get('id'));
            }

            return items.map(item => {
              return latestIds.findIndex(i => i === item.get('id')) !== -1 ? item.set('shouldUnmount', true) : item;
            }).push(newItem);
          }

          return items.push(newItem);
        });

    case NOTIFICATION_FLAG_TO_REMOVE:
      return state
        .update('items', items => {
          return items.map(item => item.get('id') === action.id ? item.set('shouldUnmount', true) : item);
        });

    case NOTIFICATION_REMOVE:
      return state
        .update('items', items => {
          if (action.id) {
            return items.filter((item) => {
              return item.get('id') !== action.id;
            });
          }

          return items.shift();
        });

    case NOTIFICATION_ADD_TIMEOUT:
      return state
        .update('items', items => {
          return items.map((item, i) => {
            return item.set('timeout', action.timers[i]);
          });
        });

    case NOTIFICATION_REMOVE_TIMEOUT:
      return state
        .update('items', items => {
          return items.map((item) => {
            clearTimeout(item.get('timeout'));

            return item;
          });
        });

    default:
      return state;
  }
}
