import React, { Component }     from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import Notification             from '../Notification/Notification';
import { List }                 from 'immutable';
import {
  manageTimeoutNotification
}                               from '../../../redux/notifications/actions/notificationsActions';

const propTypes = {
  notification:               PropTypes.object,
  dispatch:                   PropTypes.func
};

const defaultProps = {
  notification: {},
  dispatch: () => {}
};

@connect(state => ({
  notification: state.notifications.list.get('items', List())
}))
export default class NotificationList extends Component {
  constructor(props) {
    super(props);

    this.handleMouseOvers = this.handleMouseOvers.bind(this);
  }

  // При ховере на уведомлениях таймер изчезновения сбрасывается
  handleMouseOvers(param) {
    this.props.dispatch(manageTimeoutNotification(param));
  }

  render() {
    return (
      <div
        className={'notification-list'}
        onMouseOver={() => {
          this.handleMouseOvers(true);
        }}
        onMouseLeave={() => {
          this.handleMouseOvers(false);
        }}
      >
        <div className='notification-list__inner'>
          {this.props.notification.map((item) => {
            return (
              <Notification
                key={item.get('id')}
                {...item.toJS()}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

NotificationList.propTypes = propTypes;
NotificationList.defaultProps = defaultProps;
