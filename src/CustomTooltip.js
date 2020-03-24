import * as React from 'react';
import { getArea } from './Helpers.js';

class CustomTooltip extends React.PureComponent {
	render() {
		let tooltip = (this.props&&this.props.active && this.props&&this.props.payload) ?
			<div className="custom-tooltip">
	        <div className="tooltip">{this.props.payload[0].payload._alias}</div>
	        <div className="tooltip">Total area: {getArea(this.props.payload[0].payload.total_area,this.props.reportUnits, true)}</div>
	        <div className="tooltip">Country area: {getArea(this.props.payload[0].payload.country_area,this.props.reportUnits, true)}</div>
	        <div className="tooltip">Protected area: {getArea(this.props.payload[0].payload.current_protected_area,this.props.reportUnits, true)}</div>
        </div> : null;
		return (tooltip);
	}
}

export default CustomTooltip;
