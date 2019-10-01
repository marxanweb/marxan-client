import React from 'react';

class Notification extends React.Component {
	render() {
		return (
			<div className={"notification"}>
				<div className={"notificationType"}>{this.props.type}</div>
		    	<div dangerouslySetInnerHTML={{__html: this.props.html}}></div>
		    </div>
		);
	}
}

export default Notification;
