import React from 'react';
import Notification from './Notification.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';

class Notifications extends React.Component {
	render() {
		//get the visible notifications
		let notifications = this.props.notifications && this.props.notifications.filter(item => item.visible);
	    notifications = notifications.map((item)=>{
	        return <Notification html={item.html} type={item.type} key={item.id} removeNotification={this.props.removeNotification.bind(this, item)}></Notification>;
	    });
		return (
		    <div className={"notifications"} style={{display: (this.props.open && notifications.length > 0) ? 'block' : 'none'}}>
	            <div className="notificationsTitle"><FontAwesomeIcon icon={faBell} style={{fontSize: '16px'}}/><span className={"notificationsTitleText"}>Notifications</span><span className={"closeWindow"} onClick={this.props.hideNotifications} title={"Close"}>x</span></div>
		        {notifications}
		        <div className={"notificationPointer"}></div>
		    </div>
		);
	}
}

export default Notifications;
