import React from "react";
import Slider from 'material-ui/Slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';

class TransparencyControl extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSlider: false
		};
		this.old_opacity = 0.5;
	}
	onChange(evt, newValue) {
		if (this.props.layer) {
			//set a local property to capture the old opacity
			this.old_opacity = this.props.opacity;
			this.props.changeOpacity(this.props.layer.id, newValue);
		}
	}

	toggleLayer() {
		if (this.props.layer) {
			//see if the layer is currently visible
			if (this.props.opacity > 0) {
				//hide the layer
				this.onChange(undefined, 0);
			} else {
				//show the layer
				this.onChange(undefined, this.old_opacity);
			}
		}
	}
	mouseEnter(event) {
		this.setState({
			showSlider: true
		});
	}

	mouseLeave(event) {
		this.setState({
			showSlider: false
		});
	}

	render() {
		return (
			<div style={ this.props.style }>
				<div onMouseEnter={ this.mouseEnter.bind(this) } onMouseLeave={ this.mouseLeave.bind(this) } style={ { position: 'absolute', width: '132px', height: '23px' } } title={ "Change transparency - click to toggle layer" }>
					<FontAwesomeIcon icon={(this.props.opacity === 0 ) ? faEyeSlash : faEye } style={ { color: 'gainsboro' } } onClick={ this.toggleLayer.bind(this) } />
					<Slider value={ this.props.opacity } onChange={ this.onChange.bind(this) } style={ { display: (this.state.showSlider) ? "inline-block" : "none", width: '100px', position: 'absolute', top: '2px', left: '26px' } } sliderStyle={ { margin: '0px' } } />
				</div>
			</div>
			);
	}
}

export default TransparencyControl;
