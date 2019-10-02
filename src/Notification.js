import React from 'react';

class Notification extends React.Component {
	render() {
		return (
			<div className={"notification"}>
				<div className={"notificationType"}>{this.props.type}<span className={"removeNotification"} onClick={this.props.removeNotification} title={"Dismiss"}>x</span></div>
		    	<div dangerouslySetInnerHTML={{__html: this.props.html}}></div>
		    </div>
		);
	}
}

export default Notification;
