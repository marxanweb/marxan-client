import React from "react";
import MarxanDialog from "./MarxanDialog";
import Notification from './Notification.js';
import FlatButton from 'material-ui/FlatButton';
import ToolbarButton from './ToolbarButton';
import Checkbox from 'material-ui/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons';
class Welcome extends React.Component {
    constructor(props) {
      super(props);
      this.state = {checked:true};
    }
    toggleShowWelcomeScreen(evt, isInputChecked) {
      this.setState({checked: isInputChecked});
    }
    onOk(){
      this.props.saveOptions({"SHOWWELCOMESCREEN": this.state.checked});
      this.props.onOk(); 
    }
    openNewProjectDialog(){
      this.onOk();
      this.props.openNewProjectDialog();
    }
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
        onOk={this.onOk.bind(this)}
        showCancelButton={false}
				autoDetectWindowHeight={false}
				bodyStyle={{ padding:'0px 24px 0px 24px'}}
        children={
          <React.Fragment key={'welcomeKey'}>
            <div className={'welcomeContent'}>
            <div style={{verticalAlign:'middle'}}>
                <span className={'tabTitle'} style={{verticalAlign:'middle'}}>Notifications</span>
                <FlatButton icon={<FontAwesomeIcon icon={faSync}/>}  title={"Reset notifications"} onClick={this.props.resetNotifications} style={{minWidth:'24px',height:'24px',lineHeight:'24px',color:'rgba(0,0,0,0.67)'}}/>
              </div>
              <div className={'notifications'}>
                {notificationsPanel}
              </div>
              <div className={'tabTitle tabTitleTopMargin'}>What do you want to do?</div>
              <div className={'task'}>
                <ToolbarButton icon={<FontAwesomeIcon icon={faDraftingCompass}/>}  title={"Design/extend a protected area network"} onClick={this.openNewProjectDialog.bind(this)} className={"resetNotifications"}/>
                <span>Create a new project to design/extend a protected area network for a country</span>
              </div>
            </div>
					  <div className="welcomeToolbar">
						  <Checkbox label="Show at startup" style={{fontSize:'12px'}} checked={this.state.checked} onCheck={this.toggleShowWelcomeScreen.bind(this)} className={'showAtStartupChk'}/>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default Welcome;
