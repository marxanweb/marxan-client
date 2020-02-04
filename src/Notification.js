import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

class Notification extends React.Component {
	render() {
		var icon;
		switch (this.props.type) {
			case 'Hardware Issue':
				icon = <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', paddingRight:'5px',fontSize:'18px'}}/>;
				break;
			case 'Data Update':
			case 'Software Update':
				icon = <FontAwesomeIcon icon={faCloudDownloadAlt} style={{color:'red', paddingRight:'5px',fontSize:'18px'}}/>;
				break;
			case 'Training':
				icon = <FontAwesomeIcon icon={faChalkboardTeacher} style={{paddingRight:'5px',fontSize:'18px'}}/>;
				break;
			case 'News':
				icon = <FontAwesomeIcon icon={faNewspaper} style={{paddingRight:'5px',fontSize:'18px'}}/>;
				break;
			default:
				icon = null;
				// code
		}
		return (
			<div className={"notification"}>
				<div className={"notificationType"} title={this.props.type}>{icon}<span dangerouslySetInnerHTML={{__html: this.props.html}} className={'notificationText'}></span><span className={"removeNotification"} onClick={this.props.removeNotification} title={"Dismiss"}>x</span></div>
		    </div>
		);
	}
}

export default Notification;
