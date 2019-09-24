import * as React from 'react';
import LogItem from './LogItem';

class Log extends React.Component {
	render() {
		let children = this.props.messages.map((message, index) => {
			//message cleaning and formatting
			switch (message.status) {
				case 'RunningMarxan': //from marxan runs - remove all the double line endings
					Object.assign(message, { info: message.info.replace(/(\n\n {2}Init)/gm, "\n  Init").replace(/(\n\n {2}ThermalAnnealing)/gm, "\n  ThermalAnnealing").replace(/(\n\n {2}Iterative)/gm, "\n  Iterative").replace(/(\n\n {2}Best)/gm, "\n  Best") });
					break;
				default:
					break;
			}
			//if there is an error, then set that as the message
			if (message.hasOwnProperty('error')) Object.assign(message, { info: message.error });
			return <LogItem message={message} key={index} preprocessing={this.props.preprocessing}/>;
		});
		return (
			<div id="log" onMouseEnter={this.props.mouseEnter} onMouseLeave={this.props.mouseLeave}>{children}</div>
		);
	}
}

export default Log;
