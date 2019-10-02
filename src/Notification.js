import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

class Notification extends React.Component {
	render() {
		let icon = (this.props.type === "Hardware Issue") ? <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', paddingRight:'5px'}}/> : null;
		return (
			<div className={"notification"}>
				<div className={"notificationType"}>{icon}{this.props.type}<span className={"removeNotification"} onClick={this.props.removeNotification} title={"Dismiss"}>x</span></div>
		    	<div dangerouslySetInnerHTML={{__html: this.props.html}}></div>
		    </div>
		);
	}
}

export default Notification;
