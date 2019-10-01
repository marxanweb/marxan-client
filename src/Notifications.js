import React from 'react';
import Notification from './Notification.js';

class Notifications extends React.Component {
	render() {
	    let notifications = this.props.notifications && this.props.notifications.map((item)=>{
	        let show = (item.showForRoles.indexOf(this.props.role)>-1);
	        return (show) ? <Notification html={item.html} type={item.type} key={item.id}></Notification> : null;
	    });
		return (
		    <div className={"notifications"} style={{display: (this.props.notifications && (this.props.notifications.length > 0)) ? 'block' : 'none'}}>
	            <div className="notificationsTitle">Notifications</div>
		        {notifications}
		    </div>
		);
	}
}

export default Notifications;
