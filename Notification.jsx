import React, { Component }     from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import {
  removeNotification
}                               from '../../../redux/notifications/actions/notificationsActions';

const propTypes = {
  id:                 PropTypes.string,
  text:               PropTypes.string,
  type:               PropTypes.string,
  shouldUnmount:      PropTypes.bool,
  dispatch:           PropTypes.func
};

const defaultProps = {
  id: '',
  text: '',
  type: '',
  shouldUnmount: false,
  dispatch: () => {}
};

const MAIN_TIMEOUT = 1000;

@connect(() => ({}))
export default class Notification extends Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    const notificationPresentational = this.notificationPresentational;
    const notification = this.notification;
    const height = notificationPresentational ? this.notificationPresentational.offsetHeight : 70;

    if (notification && notificationPresentational) {
      this.notification.style.height = `${height}px`;
      this.notification.style.marginBottom = '10px';

      setTimeout(() => {
        notificationPresentational.classList.add('notification__presentational--in');
      }, MAIN_TIMEOUT);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Если пришел пропс на удаление - убираем уведомление
    if (nextProps.shouldUnmount) {
      this.handleRemove();
    }
  }

  handleRemove() {
    const notificationPresentational = this.notificationPresentational;
    const notification = this.notification;

    if (notificationPresentational && notification) {
      notificationPresentational.classList.remove('notification__presentational--in');
      notificationPresentational.classList.add('notification__presentational--out');
      setTimeout(() => {
        notification.style.height = 0;
        notification.style.marginBottom = '0';

        setTimeout(() => {
          this.props.dispatch(removeNotification(this.props.id));
        }, MAIN_TIMEOUT);
      }, MAIN_TIMEOUT);
    }
  }

  render() {
    let alertClass = '';
    let label = '';

    switch (this.props.type) {
      case 'info':
        alertClass = 'notification__presentational--info';
        label = 'Уведомление';
        break;
      case 'warning':
        alertClass = 'notification__presentational--warning';
        label = 'Внимание';
        break;
      case 'error':
        alertClass = 'notification__presentational--error';
        label = 'Ошибка';
        break;
      default:
        alertClass = '';
    }

    return (
      <div
        className={'notification'}
        style={{
          'transition': 'height 0.3s, margin 0.3s'
        }}
        ref={(notification) => {
          this.notification = notification;
        }}
      >
        <div
          className={`notification__presentational notification__presentational--in ${alertClass}`}
          ref={(notificationPresentational) => {
            this.notificationPresentational = notificationPresentational;
          }}
        >
          <header className={'notification__header'}>
            <div className={'notification__heading'}>{label}</div>
            <button
              className={'notification__control'}
              onClick={this.handleRemove}
            >
              <i className={'mdi mdi-close'}/>
            </button>
          </header>
          <div className={'notification__text'}>
            {this.props.text}
          </div>
        </div>
      </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
