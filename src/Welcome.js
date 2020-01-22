import React from "react";
import MarxanDialog from "./MarxanDialog";
import Notification from './Notification.js';
import ToolbarButton from './ToolbarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

class Welcome extends React.Component {
    render() {
        //get the visible notifications
        let notifications = this.props.notifications && this.props.notifications.filter(item => item.visible);
        notifications = notifications.map((item) => {
          return <Notification html={item.html} type={item.type} key={item.id} removeNotification={this.props.removeNotification.bind(this, item)}></Notification>;
        });
        let notificationsPanel = <div className={"notifications"}>
	        {notifications}
	        <div className={"notificationPointer"}></div>
	    </div>;
        return (
            <MarxanDialog
        {...this.props}
        contentWidth={768}
        offsetY={80}
        title="Welcome"
        helpLink={"docs_user.html#welcome"}
        showCancelButton={false}
				autoDetectWindowHeight={false}
				bodyStyle={{ padding:'0px 24px 0px 24px'}}
        children={
          <React.Fragment>
            <div className={'welcomeContent'}>
              <div className={'notifications'}>
                {notificationsPanel}
              </div>
            </div>
					  <div class="welcomeToolbar">
              <ToolbarButton icon={<FontAwesomeIcon icon={faSync}/>}  title={"Reset notifications"} onClick={this.props.resetNotifications} className={"resetNotifications"}/>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default Welcome;
